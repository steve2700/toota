import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBarDriver from './SideBarDriver';
import Header from './Header';
import classNames from 'classnames';

function LayoutDriver() {
  return (
    <div className={classNames(
      "flex flex-col bg-gray-100 h-screen w-screen overflow-hidden",
      'lg:flex-row',
    )}>
      <SideBarDriver />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LayoutDriver;

