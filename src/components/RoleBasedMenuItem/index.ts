import { TRole, TRoleMenuItem } from "../../types/role";
import { FiHome, FiUsers } from "react-icons/fi";
import { MdOutlinePerson4, MdInsights, MdSpaceDashboard } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { RiProfileLine, RiDashboardLine } from "react-icons/ri";
import { BiHomeHeart } from "react-icons/bi";

const menuItemByRole = (role: TRole): TRoleMenuItem[] => {
  const SuperAdminMenuItem = [
    { name: "Dashboard", link: "/", icon: RiDashboardLine },
    { name: "Agents", link: "/agents", icon: MdOutlinePerson4 },
    { name: "Insight", link: "/insight", icon: MdInsights },
    { name: "Properties", link: "/properties", icon: BiHomeHeart },
    { name: "Users", link: "/users", icon: FiUsers },
  ];

  const AdminMenuItem = [
    { name: "Dashboard", link: "/", icon: RiDashboardLine },
    { name: "Agents", link: "/agents", icon: MdOutlinePerson4 },
    { name: "Insight", link: "/insight", icon: MdInsights },
    { name: "Properties", link: "/properties", icon: BiHomeHeart },
  ];

  const AgentMenuItem = [
    { name: "Dashboard", link: "/", icon: RiDashboardLine },
    { name: "Profile", link: "/profile", icon: RiProfileLine },
    { name: "Insight", link: "/insight", icon: MdInsights },
    { name: "Properties", link: "/properties", icon: BiHomeHeart },
  ];

  switch (role) {
    case "super_admin":
      return SuperAdminMenuItem;
    case "admin":
      return AdminMenuItem;
    case "agent":
      return AgentMenuItem;
  }
};

export default menuItemByRole;
