import useStore from "@/utils/store";
import React, { useState, useRef, useEffect } from "react";

interface Block {
  type: string;
  value?: string;
  name?: string;
}

const TagsInput = ({ availableTags }: any) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const {
    // blocks,
    inputValue,
    showDropdown,
    filteredTags,
    activeBlockIndex,
    // setBlocks,
    setInputValue,
    setShowDropdown,
    setFilteredTags,
    setActiveBlockIndex,
  }: any = useStore();

  const globalListener = (e: any) => {
    if (inputRef && inputRef?.current?.contains(e.target)) return;
    setShowDropdown(false);
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("click", globalListener);
    }
    return () => {
      document.removeEventListener("click", globalListener);
    };
  }, [showDropdown]);

  const [showDropDown2, setShowDropDown2] = useState(false);
  const [dropdown2, setDropdown2] = useState("This month");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);

    if (/[a-zA-Z]/.test(value)) {
      setShowDropdown(true);
      setFilteredTags(
        availableTags.filter((tag: any) =>
          tag.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Backspace" && inputValue === "" && blocks.length > 0) {
      const newBlocks = [...blocks];
      newBlocks.splice(
        activeBlockIndex !== null ? activeBlockIndex : blocks.length - 1,
        1
      );
      setBlocks(newBlocks);
      setActiveBlockIndex(null);
    } else if (e.key === "Enter") {
      if (inputValue && /^\d+$/.test(inputValue)) {
        addBlock({ type: "number", value: inputValue });
        setInputValue("");
      }
      if (showDropdown && filteredTags.length > 0) {
        addBlock(filteredTags[0]);
      }
    } else if (["+", "-", "*", "/", "^", "(", ")"].includes(e.key)) {
      const numberValue = inputValue.replace(/[^0-9]/g, "");

      const updateState = async () => {
        if (numberValue) {
          await new Promise((resolve) => {
            setBlocks((prevBlocks) => {
              const newBlocks = [...prevBlocks];
              if (activeBlockIndex !== null) {
                newBlocks.splice(activeBlockIndex + 1, 0, {
                  type: "number",
                  value: numberValue,
                });
                newBlocks.splice(activeBlockIndex + 2, 0, {
                  type: "symbol",
                  value: e.key,
                });
                setActiveBlockIndex(activeBlockIndex + 2);
              } else {
                newBlocks.push({ type: "number", value: numberValue });
                newBlocks.push({ type: "symbol", value: e.key });
              }
              resolve(newBlocks);
              return newBlocks;
            });
          });
        } else {
          await new Promise((resolve) => {
            setBlocks((prevBlocks) => {
              const newBlocks = [...prevBlocks];
              if (activeBlockIndex !== null) {
                newBlocks.splice(activeBlockIndex + 1, 0, {
                  type: "symbol",
                  value: e.key,
                });
                setActiveBlockIndex(activeBlockIndex + 1);
              } else {
                newBlocks.push({ type: "symbol", value: e.key });
              }
              resolve(newBlocks);
              return newBlocks;
            });
          });
        }
        setInputValue("");
      };

      updateState();
      e.preventDefault();
    } else if (
      e.key === "ArrowLeft" &&
      activeBlockIndex !== null &&
      activeBlockIndex > 0
    ) {
      setActiveBlockIndex(activeBlockIndex - 1);
    } else if (
      e.key === "ArrowRight" &&
      activeBlockIndex !== null &&
      activeBlockIndex < blocks.length - 1
    ) {
      const newBlocks = [...blocks];
      setActiveBlockIndex(activeBlockIndex + 1);
    } else if (e.key === "ArrowLeft" && activeBlockIndex === null) {
      setActiveBlockIndex(blocks.length - 2);
    }
  };

  const addBlock = (block: any) => {
    let newBlocks = [...blocks];
    console.log("newBlocks1", newBlocks);
    if (activeBlockIndex !== null) {
      newBlocks.splice(activeBlockIndex + 1, 0, block);
    } else {
      console.log("block", block);
      newBlocks.push(block);
    }
    console.log("newBlocks", newBlocks);
    setBlocks(newBlocks);
    setInputValue("");
    setShowDropdown(false);
    setActiveBlockIndex(null);
  };

  const handleTagSelect = (tag: any) => {
    addBlock({ type: "tag", ...tag });
  };

  const [items, setItems] = useState([
    "this month",
    "1 months",
    "2 months",
    "3 months",
    "4 months",
  ]);
  console.log("blocks", blocks);

  const renderBlocks = () => {
    return blocks.map((block, index) => {
      if (block.type === "tag") {
        return (
          <span
            key={index}
            className={`flex ${activeBlockIndex === index ? "pr-0" : " pr-2"}`}
            onClick={() => setActiveBlockIndex(index)}
          >
            <div
              className={`border border-blue-400 flex items-center px-4 rounded-full bg-blue-50 py-2 ${
                activeBlockIndex === index ? "active" : ""
              }`}
            >
              <p className="flex whitespace-nowrap text-blue-800 capitalize">
                #{block.name}
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowDropDown2(!showDropDown2)}
                  className="text-gray-800 bg-gray-200 px-3 rounded-full py-2 border-gray-400 border ml-2 mr-[-16px] my-[-8px]"
                >
                  {dropdown2}
                </button>
                {activeBlockIndex === index && (
                  <>
                    {showDropDown2 && (
                      <div className="dropdown absolute bg-white border mt-1">
                        {items.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setDropdown2(item);
                              setShowDropDown2(false);
                            }}
                            className="dropdown-item p-2 cursor-pointer hover:bg-gray-200"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {activeBlockIndex === index && (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder=""
                style={{ width: `${inputValue.length + 1}ch` }}
                autoFocus
              />
            )}
          </span>
        );
      } else if (block.type === "symbol" || block.type === "number") {
        return (
          <span
            key={index}
            className={`flex ${activeBlockIndex === index ? "pr-0" : " pr-2"}`}
            onClick={() => setActiveBlockIndex(index)}
          >
            <div
              className={`flex items-center ${
                activeBlockIndex === index ? "active" : ""
              }`}
            >
              {block.value}
            </div>
            {activeBlockIndex === index && (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder=""
                style={{ width: `${inputValue.length + 1}ch` }}
                autoFocus
              />
            )}
          </span>
        );
      }
      return null;
    });
  };
  const calculateResult = () => {
    // Helper function to evaluate a list of blocks
    const evaluateBlocks = (blocks: Block[]) => {
      let result = 0;
      let currentNumber = "";
      let lastOperator: any = "+";

      blocks.forEach((block, index) => {
        if (block.type === "number") {
          currentNumber += block.value;
        } else if (block.type === "symbol") {
          if (currentNumber) {
            const num = parseFloat(currentNumber);
            if (lastOperator === "+") {
              result += num;
            } else if (lastOperator === "-") {
              result -= num;
            } else if (lastOperator === "*") {
              result *= num;
            } else if (lastOperator === "/") {
              result /= num;
            } else if (lastOperator === "^") {
              result = Math.pow(result, num);
            }
            currentNumber = "";
          }
          lastOperator = block.value;
        } else if (block.type === "tag") {
          currentNumber += block.value || "0";
        }

        // Handle implicit multiplication
        if (
          index < blocks.length - 1 &&
          (block.type === "number" || block.type === "tag")
        ) {
          const nextBlock = blocks[index + 1];
          if (nextBlock.type === "number" || nextBlock.type === "tag") {
            lastOperator = "*";
          }
        }
      });

      // Handle the last number in the sequence
      if (currentNumber) {
        const num = parseFloat(currentNumber);
        if (lastOperator === "+") {
          result += num;
        } else if (lastOperator === "-") {
          result -= num;
        } else if (lastOperator === "*") {
          result *= num;
        } else if (lastOperator === "/") {
          result /= num;
        } else if (lastOperator === "^") {
          result = Math.pow(result, num);
        }
      }

      return result;
    };

    // Helper function to handle parentheses
    const evaluateParentheses = (blocks: Block[]) => {
      const stack: Block[][] = [];
      let currentBlocks: Block[] = [];

      blocks.forEach((block) => {
        if (block.type === "symbol" && block.value === "(") {
          // Start a new group
          stack.push(currentBlocks);
          currentBlocks = [];
        } else if (block.type === "symbol" && block.value === ")") {
          // Evaluate the current group and merge with the previous group
          const groupResult = evaluateBlocks(currentBlocks);
          currentBlocks = stack.pop() || [];
          currentBlocks.push({ type: "number", value: groupResult.toString() });
        } else {
          // Add the block to the current group
          currentBlocks.push(block);
        }
      });

      // Evaluate the remaining blocks
      return evaluateBlocks(currentBlocks);
    };

    // Evaluate the entire expression, starting with parentheses
    return evaluateParentheses(blocks);
  };
  return (
    <div className="tags-input-container w-full">
      <div className="flex border flex-wrap p-2 gap-y-2 items-center  w-full border-blue-500">
        <p className="mr-1 font-bold text-[20px]">=</p>
        {renderBlocks()}
        {activeBlockIndex === null && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(true)}
            placeholder={blocks?.length === 0 ? "Type here..." : ""}
          />
        )}
      </div>
      {showDropdown && (
        <div className="dropdown max-h-[300px] overflow-y-scroll">
          {filteredTags.map((tag: any) => (
            <div
              key={tag.id}
              onClick={() => handleTagSelect(tag)}
              className="dropdown-item"
            >
              <p className="text-[16px] font-bold capitalize">{tag.name}</p>
              <span className="flex gap-3 items-center text-gray-500 justify-between text-[12px] capitalize">
                <p>{tag.category}</p>
                <p className="">Value{tag.value}</p>
              </span>
            </div>
          ))}
        </div>
      )}
      <span>
        <p className="text-[16px] font-semibold mt-4">
          Result: {calculateResult()}
        </p>
      </span>
    </div>
  );
};

export default TagsInput;
