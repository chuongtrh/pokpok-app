import { Flex, Box, Spacer, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GoogleClientId, loginWithGoogle } from "@/shared/api";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function Navbar() {
  let [token, setToken] = useState("");
  let [user, setUser] = useState({});

  useEffect(() => {
    localStorage.setItem("token", token);
    // handleLogin(token);
  }, [token]);

  const handleResponseGoogle = async (response) => {
    const { credential } = response;
    if (credential) {
      await loginWithGoogle(credential);
      //   const { user, token } = await loginWithGoogle(credential);
      //   if (user && token) {
      //     setUser(user);
      //     setToken(token);
      //   }
    }
  };
  return (
    <>
      <Flex bg={"gray.200"} mb="4">
        <Spacer />
        <Box p="4">
          <GoogleOAuthProvider clientId={GoogleClientId}>
            <GoogleLogin
              onSuccess={handleResponseGoogle}
              onError={() => {
                console.log("Login Failed");
              }}
              size="large"
              locale="vi_VN"
              auto_select
              useOneTap
            ></GoogleLogin>
          </GoogleOAuthProvider>
        </Box>
      </Flex>
    </>
  );
}
