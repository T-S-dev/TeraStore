"use client";

import Dropzone from "@/components/Dropzone";
import TableWrapper from "@/components/table/TableWrapper";
import useDetails from "@/hooks/useDetails";

const page = () => {
  const { skeletonFiles, error } = useDetails();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex-1">
      <Dropzone />
      <section className="container mt-6">
        <TableWrapper skeletonFiles={skeletonFiles} />
      </section>
    </div>
  );
};

export default page;
