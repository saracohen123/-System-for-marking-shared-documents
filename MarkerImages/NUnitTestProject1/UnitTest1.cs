using infraDALContracts;
using NUnit.Framework;
using System;
using System.Data;
using DI_Factory;
//using System.Data.SqlClient;
using DalParametersConverter;
using MarkerContracts.DTO;
using DALimpSQL;
using MarkerContracts.Interfaces;

namespace NUnitTestProject1
{
    public class Tests
    {
        DBParameterConverter _paramConverter;
        [SetUp]
        public void Setup()
        {


        }

        [Test]
        public void Test1()
        {
            var resolver = new Resolver();
            
            //var dal = resolver.Resolve<IInfraDal>();
            IInfraDal dal = new SQLDAL();
            //IUserDal u = resolver.Resolve<IUserDal>();
            IDocumentDAL u = resolver.Resolve<IDocumentDAL>();
            //UserRequest use = new UserRequest() { UserID = "ss@g.com", UserName = "ahhhv" };

            u.CreateDocument(new Document() {    UserID="E@gmail.com", ImageURL="k.png" , DocumentName = "image" });




            //_paramConverter = new DBParameterConverter(dal);
            //var con = dal.Connect("Server=(localdb)\\MSSQLLocalDB;Database=Images;" +
            //   "Trusted_Connection=True;");
            ////IInfraDal dal = new SQLDAL();
            ////IDBParameter p = resolver.Resolve<IDBParameter>();
            ////p.ParameterName = "UserID";
            ////p.Value = "SSS@G.COM";
            ////IDBParameter p1 = resolver.Resolve<IDBParameter>();
            ////p1.ParameterName = "UserName";
            ////p1.Value = "rachel";
            ////UserRequest u = new UserRequest() { UserID = "rrer@g.com", UserName = "leah levi" };
            //DocumentRequset d = new DocumentRequset() { DocumentName = "new doc", ImageURL = "k.png", UserID = "rrer@g.com" };
            //var p = _paramConverter.ConvertToParameter(d, "UserID");
            //var p1 = _paramConverter.ConvertToParameter(d, "ImageURL");
            //var p2 = _paramConverter.ConvertToParameter(d, "DocumentName");
            //dal.ExecSPQuery("CreateDocument", con, p, p1, p2);


            //var dataset = dal.ExecSPQuery("GetUsers", con);
            //Console.WriteLine(dataset.Tables[0].Rows.Count);
            //foreach (DataRow row in dataset.Tables[0].Rows)
            //{
            //    Console.WriteLine("{0},{1}", row[0], row[1]);
            //}





        }
    }
}