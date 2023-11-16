import EditChild from 'layouts/child/EditChild/EditChild';
import AddChild from 'layouts/parent/AddChild/AddChild';
import AddUser from 'layouts/parent/AddUser/AddUser';
import EditTable from 'layouts/parent/EditTable/EditTable';
import Parent from 'layouts/parent/parent';
import SetPassWord from 'layouts/parent/Password/SetPassWord';
import AddStaff from 'layouts/StaffList/AddStaff/AddStaff';
import StaffList from 'layouts/StaffList/StaffList';
import React, { Component } from 'react';
import { Routes, Route } from "react-router-dom";

export default class Path extends Component {
    render() {
        return (
            <Routes>
                <Route path = "/parent" element = { <Parent /> } />
                <Route path = "/parent/add" element = { <AddUser />} />
                <Route path = "/parent/edit/:id" element = {<EditTable />} />
                <Route path = "/parent/addchild/:id" element = {<AddChild />} />
                <Route path = "/parent/password/:id" element = {<SetPassWord />} />

                <Route path = "/child" element = {<Child />} />
                <ComponentRoute path = "/child/editchild/:id" element = {<EditChild />} />

                <Route path = "/staffList" element = {<StaffList />} />
                <ComponentRoute path = "/staffList/add" element = {<AddStaff />} />                
            </Routes>
        );
    }
}
