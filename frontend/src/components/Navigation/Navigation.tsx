import { type FC, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  IconButton,
  useIsMobile,
} from "@cfa/react-core";
import { Menu as MenuIcon } from "@cfa/system-icons";

import "./Navigation.scss";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "nav-topbar-link",
    isActive ? "nav-topbar-link--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

const Navigation: FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useIsMobile();

  const navLinks = (
  <>
    <NavLink to="/" className={navLinkClass}>
      Home
    </NavLink>

    <NavLink to="/locations" className={navLinkClass}>
      Locations
    </NavLink>

    <NavLink to="/inventory" className={navLinkClass}>
      Inventory
    </NavLink>

    <NavLink to="/field-tech" className={navLinkClass}>
      Field Tech
    </NavLink>
  </>
);

  return (
    <nav className="nav-topbar">
      {isMobile && (
      <Drawer.Root>
        <IconButton>
          <MenuIcon />
        </IconButton>

      <Drawer.Tray>
        <div className="nav-drawer__links">
          {navLinks}
        </div>
        </Drawer.Tray>
      </Drawer.Root>
    )}

      {!isMobile && (
      <div className="nav-topbar__section nav-topbar__section--middle">
        {navLinks}
      </div>
      )}

      <Drawer.Root>
  <IconButton>
    <MenuIcon />
  </IconButton>
  <Drawer.Tray>
    {navLinks}
    </Drawer.Tray>
  </Drawer.Root>
    </nav>
  );
};

export default Navigation;