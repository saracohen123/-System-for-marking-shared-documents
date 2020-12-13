using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using MarkerContracts.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MarkerIMG.Controllers
{
    [Route("api/[controller]/{action}")]
    [ApiController]
    public class Upload : ControllerBase
    {
        IConfiguration _configuration;
        public Upload(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        [HttpPost]
        public Response Uploadf()
        {
            //Uploading an image
            try
            {
                var file = Request.Form.Files[0];
                var pathToSave = _configuration.GetConnectionString("pathToSave");
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = fullPath;

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return new ResponseUploaded();
                }
                else
                {
                    return new ResponseMistakeDetails();
                }
            }
            catch
            {
                return new ResponseErr();

            }
        }



    }
}
