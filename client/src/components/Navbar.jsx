import { Menu, School, LayoutDashboard, LogOut, User } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "./DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const role = user?.role;

  const [logoutUser, { isSuccess, data }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logout successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0A0A0A] border-b dark:border-gray-800 ">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={"/"}>
          <div className="flex items-center gap-2">
            <School size={28} />
            <h1 className="font-extrabold text-xl sm:text-2xl">E-Learning</h1>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user.photoUrl || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>EL</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={"my-learning"}>
                  <DropdownMenuItem className="gap-2">
                    <User size={16} /> My Learning
                  </DropdownMenuItem>
                </Link>

                <Link to={"profile"}>
                  <DropdownMenuItem className="gap-2">
                    <User size={16} /> Edit Profile
                  </DropdownMenuItem>
                </Link>

                {role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2">
                      <LayoutDashboard size={16} /> Dashboard
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logoutHandler}
                  className="gap-2 text-red-500"
                >
                  <LogOut size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => navigate("/login")} variant="outline">
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}

          <DarkMode />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <DarkMode />
          <MobileNavbar user={user} role={role} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;

const MobileNavbar = ({ user, role }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <School size={24} /> E-Learning
          </SheetTitle>
        </SheetHeader>

        {/* Menu */}
        <nav className="flex flex-col gap-4 mt-6 text-sm p-4">
          {user ? (
            <>
              <button className="flex items-center gap-2 hover:text-primary">
                <User size={16} /> My Learning
              </button>
              <button className="flex items-center gap-2 hover:text-primary">
                <User size={16} /> Edit Profile
              </button>

              {role === "instructor" && (
                <button className="flex items-center gap-2 hover:text-primary">
                  <LayoutDashboard size={16} /> Dashboard
                </button>
              )}

              <button className="flex items-center gap-2 text-red-500 mt-4">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Button variant="outline">Login</Button>
              <Button>Signup</Button>
            </div>
          )}
        </nav>

        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
