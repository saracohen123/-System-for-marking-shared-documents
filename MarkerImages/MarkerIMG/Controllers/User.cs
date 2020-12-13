using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MarkerContracts.DTO;
using MarkerContracts.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MarkerIMG.Controllers
{
    [Route("api/[controller]/{action}")]
    [ApiController]
    public class User : ControllerBase
    {
        IUserService _UserService;
        public User(IUserService UserService)
        {
            _UserService = UserService;
        }

        [HttpGet]
        public Response GetUsers()
        {
            return this._UserService.GetUsers();
        }

      
        [HttpPost]
        public Response CreateUser([FromBody] MarkerContracts.DTO.User user)
        {
            return _UserService.CreateUser(user);
        }
        
        [HttpPost]
        public Response LogIn([FromBody] MarkerContracts.DTO.User user)
        {
            return _UserService.LogIn(user);
        }

        [HttpPost]
        public Response RemoveUser([FromBody] MarkerContracts.DTO.User user)
        {
            return _UserService.RemoveUser(user);
        }



    }
}
