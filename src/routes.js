/**
=========================================================
* Material Dashboard 2 React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Parent from "layouts/parent/parent"
import Child from "layouts/child/Child"
// @mui icons
import Icon from "@mui/material/Icon";
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import ListAltIcon from '@mui/icons-material/ListAlt';

import AddUser from "layouts/parent/AddUser/AddUser";
import EditTable from "layouts/parent/EditTable/EditTable";
import AddChild from "layouts/parent/AddChild/AddChild";


import EditChild from "layouts/child/EditChild/EditChild";
import SetPassWord from "layouts/parent/Password/SetPassWord";
import ClassList from "layouts/ClassList/ClassList";
import StaffList from "layouts/StaffList/StaffList";
import AddStaff from "layouts/StaffList/AddStaff/AddStaff";
// import ChildCare from "@material-ui/icons/ChildCare";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Parent",
    key: "parent",
    icon: <Icon fontSize="small">persons</Icon>,
    route: "/parent",
    component: <Parent />,
  },

  {
    type: "collapse",
    name: "Child",
    key: "child",
    icon: <ChildCareIcon fontSize="small"></ChildCareIcon>,
    route: "/child",
    component: <Child />,
  },
  {
    type: "collapse",
    name: "Class List",
    key: "classList",
    icon: <ClassRoundedIcon fontSize="small"></ClassRoundedIcon>,
    route: "/classList",
    component: <ClassList />,
  },
  {
    type: "collapse",
    name: "Staff List",
    key: "staffList",
    icon: <ListAltIcon fontSize="small"></ListAltIcon>,
    route: "/staffList",
    component: <StaffList />,
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/sign-in",
  //   component: <SignIn />,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },

  {
     key: "add",
     route: "/parent/add",
     component: <AddUser />
  },
  {
    key: "edit",
    route: "/parent/edit/:id",
    component: <EditTable />
 },
 {
  key: "add",
  route: "/parent/addchild/:id",
  component: <AddChild />
},
{
  key: "editChild",
  route: "/child/editchild/:id",
  component: <EditChild />
},
{
  key:"setPassword",
  route:"/parent/password/:id",
  component:<SetPassWord />
},
{
  key: "addStaff" ,
  route:"/staffList/add",
  component:<AddStaff />
},
];

export default routes;
