using MarkerContracts.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace MarkerContracts.Interfaces
{
    public interface IUserService
    {
        Response CreateUser(User user);
        Response LogIn(User user);
        Response RemoveUser(User user);
        Response GetUsers();
    }
}
