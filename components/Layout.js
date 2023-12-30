// import { useSession, signIn } from "next-auth/react";
// import Nav from "@/components/Nav";
// import { useEffect, useState } from "react";
// import Logo from "@/components/Logo";
// import styles from './MyComponent.module.css';
// import { fetchAdminEmails } from "@/pages/api/fetchAdminEmails";

// export default function Layout({ children }) {
//   const [showNav, setShowNav] = useState(false);
//   const [adminEmails, setAdminEmails] = useState([]);
//   const [adminStatuss, setAdminStatuss] = useState([]);

//   const [userStatus, setUserStatus] = useState(null); // 1: Approved, 0: Suspended, -1: Blocked
//   const { data: session } = useSession();

//   useEffect(() => {
//     async function loadAdminEmails() {
//       const emailsArray = await fetchAdminEmails();
//       const emails = emailsArray.map(obj => obj.email); // Extract email addresses from objects
//       setAdminEmails(emails);

//       const statuss = emailsArray.map(obj => obj.isBlock); // Extract email addresses from objects
//       setAdminStatuss(statuss);

//     }
//     loadAdminEmails();
//   }, []);

//   useEffect(() => {
//     if (session) {
//       // Check if the user is an admin
//       if (adminEmails.includes(session.user.email)) {
//         const userAdminIndex = adminEmails.findIndex(info => info.startsWith(session.user.email));
//         //console.log(userAdminIndex)
//         const isBlocked = adminStatuss[userAdminIndex]; // Get the corresponding admin status
//         // console.log(isBlock)

//         if (isBlocked === 1) {
//           setUserStatus(1); // Approved
//         } else if (isBlocked === 0) {
//           setUserStatus(0); // Suspended
//         } else if (isBlocked === -1) {
//           setUserStatus(-1); // Blocked
//         } else {
//           setUserStatus(-2); // User is not an admin or other error occurred
//         }
//       } else {
//         setUserStatus(-2); // User is not an admin
//       }
//     }
//   }, [session, adminEmails]);

//   if (!session) {
//     return (
//       <div className="w-screen h-screen flex items-center">
//         <div className="text-center w-full">
//           <button onClick={() => signIn('google')} className={`${styles.myLink} bg-white rounded-lg`}>
//             Login with Google
//             <span className={styles.highlight}></span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-bgGray min-h-screen">
//       <div className="flex-grow p-4">
//         {userStatus === 1 ? (
//           <div>
//             <div className="block md:hidden flex items-center">
//               <button onClick={() => setShowNav(true)}>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//                   <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
//                 </svg>
//               </button>
//               <div className="flex grow justify-center mr-6">
//                 <Logo />
//               </div>
//             </div>
//             <div className="flex body-background min-h-screen">
//               <Nav show={showNav}/>
//               <div className="flex-grow p-4">
//                 {children}
//               </div>
//             </div>
//           </div>        
//         ) : userStatus === 0 ? (
//           // Render the suspended content
//           <div>Your account is suspended.</div>
//         ) : userStatus === -1 ? (
//           // Render the blocked content
//           <div>Your account is blocked.</div>
//         ) : userStatus === -2 ? (
//           // Render the non-admin content
//           <div>You are not allowed to use the site.</div>
//         ) : null}
//       </div>
//     </div>
//   );
// }

import { useSession, signIn } from "next-auth/react";
import Nav from "@/components/Nav";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import styles from './MyComponent.module.css';
import { fetchAdminEmails } from "@/pages/api/fetchAdminEmails";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const [userStatus, setUserStatus] = useState(null); // 1: Approved, 0: Suspended, -1: Blocked
  const { data: session } = useSession();

  useEffect(() => {
    async function loadUserStatus() {
      if (session) {
        const emailsArray = await fetchAdminEmails();
        const adminEmails = emailsArray.map(obj => obj.email);
        const adminStatuss = emailsArray.map(obj => obj.isBlock);

        if (adminEmails.includes(session.user.email)) {
          const userAdminIndex = adminEmails.findIndex(info => info.startsWith(session.user.email));
          const isBlocked = adminStatuss[userAdminIndex];

          if (isBlocked === 1) {
            setUserStatus(1); // Approved
          } else if (isBlocked === 0) {
            setUserStatus(0); // Suspended
          } else if (isBlocked === -1) {
            setUserStatus(-1); // Blocked
          } else {
            setUserStatus(-2); // User is not an admin or other error occurred
          }
        } else {
          setUserStatus(-2); // User is not an admin
        }
      }
    }

    loadUserStatus();
  }, [session]);

  if (!session) {
    return (
      <div className="w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className={`${styles.myLink} bg-white rounded-lg`}>
            Login with Google
            <span className={styles.highlight}></span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgGray min-h-screen">
      <div className="flex-grow p-4">
        {userStatus === 1 ? (
          <div>
            <div className="block md:hidden flex items-center">
              <button onClick={() => setShowNav(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex grow justify-center mr-6">
                <Logo />
              </div>
            </div>
            <div className="flex body-background min-h-screen">
              <Nav show={showNav}/>
              <div className="flex-grow p-4">
                {children}
              </div>
            </div>
          </div>
        ) : userStatus === 0 ? (
          // Render the suspended content
          <div>Your account is suspended.</div>
        ) : userStatus === -1 ? (
          // Render the blocked content
          <div>Your account is blocked.</div>
        ) : userStatus === -2 ? (
          // Render the non-admin content
          <div>You are not allowed to use the site.</div>
        ) : null}
      </div>
    </div>
  );
}
