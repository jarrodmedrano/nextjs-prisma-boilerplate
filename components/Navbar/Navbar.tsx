import React, { useState } from 'react';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { Routes } from 'lib-client/constants';
import { getAvatarPath } from 'utils';
import { FaCat } from 'react-icons/fa';
import { RiMenuLine } from 'react-icons/ri';
import Dropdown from 'components/Dropdown';
import { useViewport } from 'components/hooks';

const isActive: (router: NextRouter, pathname: string) => boolean = (router, pathname) =>
  router.pathname === pathname;

const getNavLinks = (router: NextRouter, session: Session, isMobile: boolean) => (
  <>
    {isMobile ? (
      <>
        {session ? (
          <>
            <Link href={Routes.SITE.HOME}>
              <a className="bold" data-active={isActive(router, Routes.SITE.HOME)}>
                Home
              </a>
            </Link>

            <Link
              href={{
                pathname: '/[username]',
                query: { username: session.user.username },
              }}
            >
              <a
                className="bold"
                data-active={isActive(router, `/${session.user.username}`)}
              >
                Profile
              </a>
            </Link>

            <Link href={Routes.SITE.DRAFTS}>
              <a data-active={isActive(router, Routes.SITE.DRAFTS)}>My drafts</a>
            </Link>

            <Link href={Routes.SITE.SETTINGS}>
              <a data-active={isActive(router, Routes.SITE.SETTINGS)}>Settings</a>
            </Link>

            <button onClick={() => signOut()}>
              <a>Log out</a>
            </button>
          </>
        ) : (
          <>
            <Link href={Routes.SITE.LOGIN}>
              <a>Log in</a>
            </Link>
            <Link href={Routes.SITE.REGISTER}>
              <a>Register</a>
            </Link>
          </>
        )}
      </>
    ) : (
      <>
        {session ? (
          <>
            <Link href={Routes.SITE.HOME}>
              <a className="bold" data-active={isActive(router, Routes.SITE.HOME)}>
                Home
              </a>
            </Link>

            <Link
              href={{
                pathname: '/[username]',
                query: { username: session.user.username },
              }}
            >
              <a
                className="bold"
                data-active={isActive(router, `/${session.user.username}`)}
              >
                Profile
              </a>
            </Link>

            <Link href={Routes.SITE.DRAFTS}>
              <a data-active={isActive(router, Routes.SITE.DRAFTS)}>My drafts</a>
            </Link>
          </>
        ) : (
          <>
            <Link href={Routes.SITE.LOGIN}>
              <a>Log in</a>
            </Link>
            <Link href={Routes.SITE.REGISTER}>
              <a>Register</a>
            </Link>
          </>
        )}
      </>
    )}
  </>
);

const getDropdownItems = (router: NextRouter, session: Session) =>
  session
    ? [
        <Link href={Routes.SITE.SETTINGS}>
          <a data-active={isActive(router, Routes.SITE.SETTINGS)}>Settings</a>
        </Link>,

        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>,
      ]
    : [
        <Link href={Routes.SITE.LOGIN}>
          <a>Log in</a>
        </Link>,

        <Link href={Routes.SITE.REGISTER}>
          <a>Register</a>
        </Link>,
      ];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { width } = useViewport();
  const isMobile = width < 768;

  const { data: session, status } = useSession();

  return (
    <div className="bg-gradient-to-r from-blue-300 to-blue-100">
      <DesktopNavbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        session={session}
        router={router}
        isMobile={isMobile}
      />
      {menuOpen && <MobileMenu>{getNavLinks(router, session, isMobile)}</MobileMenu>}
    </div>
  );
};

const DesktopNavbar = ({ menuOpen, setMenuOpen, session, router, isMobile }) => (
  <div className="flex justify-between h-14 px-4">
    <div className="flex">
      <div className="flex items-center gap-2">
        <FaCat className="h-10 w-10 text-violet-500" />
        <a
          href="#home"
          className="text-xl font-bold no-underline text-gray-800 hover:text-gray-600"
        >
          NP Boilerplate
        </a>
      </div>

      <nav className="hidden md:flex items-center space-x-6 h-full">
        {getNavLinks(router, session, isMobile)}
      </nav>
    </div>
    {!isMobile && session && (
      <div className="flex space-x-6">
        <Dropdown items={getDropdownItems(router, session)}>
          <img src={getAvatarPath(session.user)} width="50" height="50" />
        </Dropdown>
      </div>
    )}
    <button
      type="button"
      aria-label="Toggle mobile menu"
      onClick={() => setMenuOpen(!menuOpen)}
      className="rounded md:hidden focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-50"
    >
      <RiMenuLine
        className={`transition duration-100 ease h-8 w-8 ${
          menuOpen ? 'transform rotate-90' : ''
        }`}
      />
    </button>
  </div>
);

const MobileMenu = ({ children }) => (
  <nav className="p-4 flex flex-col space-y-3 md:hidden">{children}</nav>
);

export default Navbar;