import TagsInput from "@/widgets/example";
import { useQuery } from "react-query";
import { getAutoComplete } from "./api/getAutoComplete";
import { useMemo } from "react";

export default function Home() {
  const { data, isLoading } = useQuery({
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
      <main className="flex flex-col p-6 gap-4 items-center">
        <h1 className="text-[20px] font-medium text-gray-500 ">
          Ayobami Paul Adegbohungbe Submission
        </h1>
        <hr />
        {isLoading && (
          <h1 className="text-[20px] font-semibold ">Loading ...</h1>
        )}
        {data && (
          <>
            <h1 className="text-[24px] font-bold ">Add New Variable</h1>
            <TagsInput availableTags={tags} />
          </>
        )}
      </main>
    </div>
  );
}
