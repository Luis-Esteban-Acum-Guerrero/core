// File: layouts/MainLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import { ModuleMenu } from "../components/ModuleMenu.jsx";

export default function MainLayout({ children, moduleItems, onModuleSelect }) {
  return (
    <div className="flex min-h-screen bg-core-light dark:bg-neutral-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ModuleMenu items={moduleItems} onSelect={onModuleSelect} />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
<script src="../../node_modules/preline/preline.js"></script>;
