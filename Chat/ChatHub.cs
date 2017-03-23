using System;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Mvc;

namespace SignalRChat
{
    public class Users
    {
        public string conId { get; set; }
        public string name { get; set; }
        public string machineName { get; set; }
    }
    [HubName("myHub")]
    public class ChatHub : Hub
    {
        public static List<Users> UserList = new List<Users>();
       [HttpPost]
       public void fileUpload()
        {
            
        }
        public void Send(string name, string message, string reciever,string conId,bool isImage)
        {
            
            Clients.All.broadcastMessage(Context.User.Identity.Name.Split('\\')[1], message, reciever,conId,isImage);

        }
        public void generateUsers()
        {

        }
        public void setUsers(string id,string name)
        {
            var user = new Users();
            user.conId = id;
            user.name = name;
            user.machineName = Context.User.Identity.Name;
            var p=UserList.FirstOrDefault(i => i.machineName.Contains(user.machineName));
            if(p==null)
            {
                UserList.Add(user);
                Clients.All.generateUsers(user);
            }
            
           
            //Clients.All.getUsers(Users);
        }
       
        public override Task OnConnected()
        {
            //string userName = System.Security.Principal.WindowsIdentity.GetCurrent().Name;
            //string username = Environment.UserName;
             
            string username ="";
            username = Context.User.Identity.Name.Split('\\')[1];
            //if (System.Web.HttpContext.Current.User.Identity.IsAuthenticated)
            //{
            //     username = System.Web.HttpContext.Current.User.Identity.Name.Split('\\')[1];
            //}
            //username= Environment.GetEnvironmentVariable("USERNAME");
            // username = Request.ServerVariables["LOGON_USER"];
            //userName=System.Web.HttpContext.Current.User.Identity.Name;
            Clients.Client(Context.ConnectionId).generateUsersOnStart(UserList);
                //Clients.All.Connected(username);
            return base.OnConnected();
        }
        public override Task OnDisconnected()
        {
            var id = Context.User.Identity.Name.Split('\\')[1];
            var p = UserList.FirstOrDefault(i => i.machineName.Split('\\')[1].Contains(id));
            //var id = Context.ConnectionId;
            //id = id.ToString();
            //var p = Users.FirstOrDefault(i =>i.Contains(id));
            if(p!=null)
            { 
            UserList.Remove(p);
            Clients.All.disconnected(p.machineName.Split('\\')[1]);
            }
            //string username = "";
            //if (System.Web.HttpContext.Current.User.Identity.IsAuthenticated)
            //{
            //    username = System.Web.HttpContext.Current.User.Identity.Name.Split('\\')[1];
            //}

            //Clients.All.Disconnected(username);
            //custom logic here
            return base.OnDisconnected();
        }
    }

} 
