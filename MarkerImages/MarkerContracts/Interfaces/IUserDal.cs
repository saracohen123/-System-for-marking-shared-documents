using MarkerContracts.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace MarkerContracts.Interfaces
{
    public interface IUserDal
    {
        void CreateUser(User user);
        void RemoveUser(User user);
        //בדיקה אם משתמש קיים
        ModeUser IfUserExists(User user);
        //בדיקה אם המייל קיים
        ModeUser GetUserID(UserRequest userRequest);
        void changeTrueStatus(UserRequest userRequest);
        DataSet GetUsers();
    }
}
