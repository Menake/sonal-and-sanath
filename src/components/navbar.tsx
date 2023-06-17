import Link from "next/link";
import { motion, useCycle } from "framer-motion";
import { Navigation } from "./navigation";
import { MenuToggle } from "./navigation/toggle";
import { MenuItem } from "./navigation/menu-item";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "../session-provider";
import { useRouter } from "next/router";

const sidebar = {
  open: {
    clipPath: `circle(200% at 100% 10%)`,
    transition: {
      duration: 0.6,
    },
    zIndex: 20,
  },
  closed: {
    clipPath: "circle(15% at 100% 0%)",
    zIndex: 0,
    transition: {
      delay: 0.5,
      duration: 0.3,
    },
  },
};

export const Navbar = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { clearSession } = useSession();

  return (
    <div className="h-16 w-full pt-3">
      <div className="flex flex-row items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="z-10 flex flex-row text-2xl font-light text-stone-200">
            <span>Sonal</span>
            <div className="relative z-0 mt-2 -ml-0.5 text-3xl font-light opacity-40">
              &
            </div>
            <div className="-ml-0.5 mt-5">Sanath</div>
          </div>
        </Link>

        <nav className="hidden w-full sm:block sm:w-auto" id="navbar-dropdown">
          <ul className="mt-4 flex flex-col rounded-lg border p-4 sm:mt-0 sm:flex-row sm:space-x-8 sm:border-0">
            <li>
              <Link
                href="/"
                className="block rounded py-2 pl-3 pr-4 text-stone-200 hover:text-gray-300"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="gallery"
                className="block rounded py-2 pl-3 pr-4 text-stone-200 hover:text-gray-300"
              >
                Gallery
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("session");
                  void queryClient.invalidateQueries({ queryKey: ["session"] });
                  void router.push("/");
                }}
                className="block rounded py-2 pl-3 pr-4 text-stone-200 hover:text-gray-300 "
              >
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
        <motion.nav
          className="absolute top-0 right-0 bottom-0 left-0 overflow-hidden overscroll-none sm:hidden"
          initial={false}
          animate={isOpen ? "open" : "closed"}
        >
          <motion.div
            className="absolute top-0 right-0 bottom-0 w-full bg-[#8A9587]"
            variants={sidebar}
          >
            <Navigation>
              <MenuItem>
                <Link
                  onClick={() => toggleOpen()}
                  className="my-16 block text-center text-3xl text-stone-300"
                  href="/"
                >
                  Home
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  onClick={() => toggleOpen()}
                  className="my-16 block text-center text-3xl text-stone-300"
                  href="gallery"
                >
                  Gallery
                </Link>
              </MenuItem>
              <MenuItem>
                <button
                  className="my-16 block w-full text-center text-3xl text-stone-300"
                  onClick={() => {
                    void clearSession();
                    void router.reload();
                    toggleOpen();
                  }}
                >
                  Sign Out
                </button>
              </MenuItem>
            </Navigation>

            <div className="absolute top-5 right-5">
              <MenuToggle toggle={() => toggleOpen()} />
            </div>
          </motion.div>
        </motion.nav>
      </div>
    </div>
  );
};
