import React from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { Input } from "../components/input";
import { Separator } from "../components/separator";

export default function page2() {
  return (
    <div className="bg-blue-500 flex flex-row justify-center w-full min-h-screen">
      <div className="relative w-[1122px] h-[675px]">
        {/* Left logo */}
        <img
          className="absolute top-2 left-0 w-[273px] h-[318px] object-cover"
          alt="Logo"
          src="https://c.animaapp.com/m8ki00ztiKWciN/img/logo-1.png"
        />

        {/* Right logo */}
        <img
          className="absolute top-0 right-0 w-[273px] h-[318px] object-cover"
          alt="Logo"
          src="https://c.animaapp.com/m8ki00ztiKWciN/img/logo-1.png"
        />

        {/* Sign in form */}
        <Card className="absolute top-[47px] left-1/2 transform -translate-x-1/2 w-[440px] bg-white rounded-lg shadow-lg">
          <CardContent className="p-8">
            {/* Sign in heading */}
            <h1 className="text-5xl text-center text-[#8a5d3d] font-normal font-['Inria_Serif'] mb-8">
              Sign in
            </h1>

            {/* Username/email input */}
            <Input
              className="w-full h-[60px] mb-4 rounded-[5px] border border-solid border-[#895d3c] font-['Orienta'] text-base text-[#8d5c33] placeholder-[#8a5d3d]"
              placeholder="Username, email & phone number"
            />

            {/* Password input */}
            <Input
              className="w-full h-[60px] mb-4 rounded-[5px] border border-solid border-[#895d3c] font-['Orienta'] text-base text-[#8d5c33]"
              type="password"
              placeholder="Password"
            />

            {/* Forgot password link */}
            <div className="text-right mb-6">
              <a
                href="#"
                className="font-['Outfit'] font-medium text-[#835a3a] text-base"
              >
                Forgot Password ?
              </a>
            </div>

            {/* Login button */}
            <Button className="w-full h-[60px] bg-[#8a5d3d] rounded-[5px] font-['Orienta'] font-normal text-white text-2xl hover:bg-[#7a5235]">
              Login
            </Button>

            {/* Divider with text */}
            <div className="flex items-center justify-center mt-12 mb-8">
              <Separator className="w-[132px] h-[3px] [background:linear-gradient(228deg,rgba(138,93,61,1)_0%,rgba(196,196,196,0)_100%)]" />
              <span className="mx-2 font-['Outfit'] font-medium text-[#555151] text-xs">
                Or Sign up With
              </span>
              <Separator className="w-[132px] h-[3px] -rotate-180 [background:linear-gradient(228deg,rgba(138,93,61,1)_0%,rgba(196,196,196,0)_100%)]" />
            </div>

            {/* Social login buttons */}
            <div className="flex justify-center gap-4">
              {/* Google */}
              <Button
                variant="outline"
                className="w-[52px] h-[52px] p-0 bg-[#ebe9eb] rounded-[26px] border-[0.4px] border-solid border-[#f79aee]"
              >
                <img
                  className="w-[30px] h-[30px]"
                  alt="Google logo"
                  src="https://c.animaapp.com/m8ki00ztiKWciN/img/google-logo.svg"
                />
              </Button>

              {/* Facebook */}
              <Button
                variant="outline"
                className="w-[52px] h-[52px] p-0 bg-[#ebe9eb] rounded-[26px] border-[0.4px] border-solid border-[#f79aee]"
              >
                <img
                  className="w-[30px] h-[30px]"
                  alt="Facebook"
                  src="https://c.animaapp.com/m8ki00ztiKWciN/img/facbook.png"
                />
              </Button>

              {/* Apple */}
              <Button
                variant="outline"
                className="w-[52px] h-[52px] p-0 bg-[#ebe9eb] rounded-[26px] border-[0.4px] border-solid border-[#f79aee]"
              >
                <img
                  className="w-[25px] h-[30px]"
                  alt="Apple"
                  src="https://c.animaapp.com/m8ki00ztiKWciN/img/group.png"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
