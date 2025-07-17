"use client";

import Dropzone from "@/components/Dropzone";
import TableWrapper from "@/components/table/TableWrapper";

const Dashboard = () => {
  return (
    <div className="flex-1">
      <Dropzone />
      <section className="container mt-6">
        <TableWrapper />
      </section>
    </div>
  );
};

export default Dashboard;
