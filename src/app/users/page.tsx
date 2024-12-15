"use client"
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import TableUsers from "@/components/Tables/TableUsers";
export default function Users() {

  return (
    <>
      <DefaultLayout>
        <TableUsers />
      </DefaultLayout>
    </>
  );
}
