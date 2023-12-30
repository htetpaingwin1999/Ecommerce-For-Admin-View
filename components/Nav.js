import Link from "next/link";
import {useRouter} from "next/router";
import {signOut} from "next-auth/react";

export default function Nav({show}) {
  const inactiveLink = 'flex gap-1 p-1';
  const activeLink = inactiveLink+' bg-white text-blue-900 rounded-sm';
  const inactiveIcon = 'w-6 h-6';
  const activeIcon = inactiveIcon + ' text-primary';
  const router = useRouter();
  const {pathname} = router;
  async function logout() {
    await router.push('/');
    await signOut();
  }
  return (
    <aside className={(show?'left-0':'-left-full')+" top-0 p-4 fixed w-full nav-background text-white  min-h-screen overflow-y-auto md:static md:w-auto transition-all"}>
      
      <nav className="flex flex-col gap-2">
      <Link href={'/user'} className={pathname === '/user' ? activeLink : inactiveLink}>
        <img src="/icons/Admin.svg" alt="Dashboard" className={pathname === '/' ? activeIcon : inactiveIcon} />
        Htet Paing Win
      </Link>
      <Link href={'/'} className={pathname === '/' ? activeLink : inactiveLink}>
        <img src="/icons/Dashboard.svg" alt="Dashboard" className={pathname === '/' ? activeIcon : inactiveIcon} />
        Dashboard
      </Link>
        <Link href={'/products'} className={pathname.includes('/products') ? activeLink : inactiveLink}>
          <img src="/icons/Books.svg" alt="Books" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Products
        </Link>
        <Link href={'/product-stocks'} className={pathname.includes('/product-stocks') ? activeLink : inactiveLink}>
          <img src="/icons/Stocks.svg" alt="Stocks" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Product Stocks
        </Link>
        <Link href={'/discountbyproducts'} className={pathname.includes('/discountbyproducts') ? activeLink : inactiveLink}>
          <img src="/icons/DiscountByProducts.svg" alt="DiscountByProducts" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Discount Products
        </Link>
        <Link href={'/discountbyamount'} className={pathname.includes('/discountbyamount') ? activeLink : inactiveLink}>
          <img src="/icons/DiscountByProducts.svg" alt="DiscountByAmount" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Discount Amount
        </Link>
       
        
        <Link href={'/advertisements'} className={pathname.includes('/advertisements') ? activeLink : inactiveLink}>
          <img src="/icons/Advertisements.svg" alt="Advertisements" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Advertisement
        </Link>
        <Link href={'/categories'} className={pathname.includes('/categories') ? activeLink : inactiveLink}>
          <img src="/icons/Categories.svg" alt="Categories" className={pathname === '/' ? activeIcon : inactiveIcon} />
        Categories
        </Link>
        <Link href={'/authors'} className={pathname.includes('/authors') ? activeLink : inactiveLink}>
          <img src="/icons/Authors.svg" alt="Authors" className={pathname === '/' ? activeIcon : inactiveIcon} />
        Authors
        </Link>
        <Link href={'/orders'} className={pathname.includes('/orders') ? activeLink : inactiveLink}>
          <img src="/icons/Orders.svg" alt="Orders" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Orders
        </Link>
        <Link href={'/payments'} className={pathname.includes('/payments') ? activeLink : inactiveLink}>
          <img src="/icons/Payments.svg" alt="Payments" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Payments
        </Link>
        <Link href={'/services'} className={pathname.includes('/services') ? activeLink : inactiveLink}>
            <img src="/icons/Services.svg" alt="Services" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Services
        </Link>
        <Link href={'/events'} className={pathname.includes('/events') ? activeLink : inactiveLink}>
            <img src="/icons/Events.svg" alt="Events" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Events
        </Link>
        {/* <Link href={'/events'} className={pathname.includes('/settings') ? activeLink : inactiveLink}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={pathname.includes('/settings') ? activeIcon : inactiveIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Events
        </Link> */}
        <Link href={'/reviews'} className={pathname.includes('/reviews') ? activeLink : inactiveLink}>
            <img src="/icons/Reviews.svg" alt="Reviews" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Reviews
        </Link>
        <Link href={'/reports'} className={pathname.includes('/reports') ? activeLink : inactiveLink}>
            <img src="/icons/Reports.svg" alt="Settings" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Reports
        </Link>
        <Link href={'/admins'} className={pathname.includes('/admins') ? activeLink : inactiveLink}>
            <img src="/icons/Settings.svg" alt="Settings" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Settings
        </Link>
        <button onClick={logout} className={inactiveLink}>
            <img src="/icons/Logout.svg" alt="Logout" className={pathname === '/' ? activeIcon : inactiveIcon} />
          Logout
        </button>
      </nav>
    </aside>
  );
}