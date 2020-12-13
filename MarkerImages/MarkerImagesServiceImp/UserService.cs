using Contracts;
using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks.Dataflow;

namespace MarkerImagesServiceImp
{
    [Register(policy.singleton,typeof(IUserService))]
    public class UserService: IUserService
    {
        IUserDal _dal;
        public UserService(IUserDal dal)
        {
            _dal = dal;
        }

        public Response CreateUser(User user)
        {
            UserRequest userRequest = new UserRequest() { UserID = user.UserID };
            try
            {
                if(_dal.IfUserExists(user) ==ModeUser.ExistInactiveStatus)
                {
                    _dal.changeTrueStatus(userRequest);
                    return new ResponseOK();
                }
                if (_dal.GetUserID(userRequest) ==ModeUser.NotExist)
                {
                    _dal.CreateUser(user);
                    return new ResponseOK();
                }
                return new ResponseMistakeDetails();
            }
            catch
            {
                return new ResponseErr();
            }
        }


        public Response GetUsers()
        {
            try
            {
              var data=  _dal.GetUsers();
                ResponseListUsers responseList = new ResponseListUsers();
                responseList.ListUsers = new List<User>();
                foreach (DataRow row in data.Tables[0].Rows)
                {
                  responseList.ListUsers.Add(new User() { UserID= (string)row[0],UserName= (string)row[1] });

                }
                return responseList;
            }
            catch
            {
                return new ResponseErr();
            }
        }

        public Response LogIn(User user)
        {
            try
            {
                if (_dal.IfUserExists(user) ==ModeUser.Exist)
                {
                    return new ResponseOK();
                }
                return new ResponseUserNotExist();
            }
            catch
            {
                return new ResponseErr();
            }

        }

        public Response RemoveUser(User user)
        {
            try
            {
                if (_dal.IfUserExists(user) ==ModeUser.Exist)
                {
                    _dal.RemoveUser(user);
                    return new ResponseOK();

                }
                return new ResponseMistakeDetails();
            }
            catch
            {
                return new ResponseMistakeDetails();
            }
        }















    }
}
