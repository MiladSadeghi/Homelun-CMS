import { TRole, TRoleMenuItem } from "../../types/role";
import { FiUsers } from "react-icons/fi";
import { MdOutlinePerson4, MdInsights, MdSpaceDashboard } from "react-icons/md";
import { RiProfileLine, RiDashboardLine, RiContactsLine } from "react-icons/ri";
import { BiHomeHeart } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../feature/store";

const menuItemByRole = (role: TRole): TRoleMenuItem[] => {
  const isAgentProfileComplete: boolean | any = useSelector(
    (state: RootState) => state.userSlice.profileCompleted
  );

  const SuperAdminMenuItem: TRoleMenuItem[] = [
    { name: "Dashboard", link: "/", icon: RiDashboardLine },
    { name: "Agents", link: "/agents", icon: MdOutlinePerson4 },
    { name: "Insight", link: "/insight", icon: MdInsights },
    { name: "Properties", link: "/properties", icon: BiHomeHeart },
    { name: "Users", link: "/users", icon: FiUsers },
    { name: "Contact Us", link: "/contact", icon: RiContactsLine },
  ];

  const AdminMenuItem: TRoleMenuItem[] = [
    { name: "Dashboard", link: "/", icon: RiDashboardLine },
    { name: "Agents", link: "/agents", icon: MdOutlinePerson4 },
    { name: "Insight", link: "/insight", icon: MdInsights },
    { name: "Properties", link: "/properties", icon: BiHomeHeart },
    { name: "Contact Us", link: "/contact", icon: RiContactsLine },
  ];

  const AgentMenuItem = (): TRoleMenuItem[] => {
    return isAgentProfileComplete
      ? [
          { name: "Dashboard", link: "/", icon: RiDashboardLine },
          { name: "Profile", link: "/profile", icon: RiProfileLine },
          { name: "Insight", link: "/insight", icon: MdInsights },
          { name: "Properties", link: "/properties", icon: BiHomeHeart },
        ]
      : [{ name: "Profile", link: "/profile", icon: RiProfileLine }];
  };

  switch (role) {
    case "super_admin":
      return SuperAdminMenuItem;
    case "admin":
      return AdminMenuItem;
    case "agent":
      return AgentMenuItem();
  }
};

export default menuItemByRole;
