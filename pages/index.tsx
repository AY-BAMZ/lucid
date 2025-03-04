import TagsInput from "@/widgets/example";
import { useQuery } from "react-query";
import { getAutoComplete } from "./api/getAutoComplete";
import { useMemo } from "react";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["getAutoComplete"],
    queryFn: getAutoComplete,
  });

  const tags = useMemo(() => {
    if (data?.data) {
      const category = data?.data?.map(
        (data: {
          id: string | number;
          value: string | number;
          name: string;
          category: string;
        }) => {
          return {
            id: data.id,
            value: data.value,
            name: data.name,
            category: data.category,
          };
        }
      );
      return category;
    } else if (data) {
      const category = data?.data?.map(
        (data: {
          id: string | number;
          value: string | number;
          name: string;
          category: string;
        }) => {
          return {
            id: data.id,
            value: data.value,
            name: data.name,
            category: data.category,
          };
        }
      );
      return category;
    }
    return [];
  }, [data]);

  return (
    <div className={``}>
      <main className="flex flex-col p-6 gap-4">
        <h1 className="text-[24px] font-semibold ">Add New Variable</h1>
        <TagsInput availableTags={tags} />
      </main>
    </div>
  );
}
