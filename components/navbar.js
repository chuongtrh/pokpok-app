import { Flex, Box, Spacer, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  GoogleClientId,
  loginWithGoogle,
  setHeaderAuthorization,
  getMe,
} from "@/shared/api";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function Navbar() {
  let [token, setToken] = useState("");
  let [user, setUser] = useState({});

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setHeaderAuthorization(token);
    }
  }, [token]);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");

    async function fetchProfile() {
      if (!accessToken) return;
      const data = await getMe();
      setUser(data);
    }
    if (accessToken) {
      setToken(accessToken);
      setHeaderAuthorization(accessToken);
      fetchProfile();
    }
  }, []);

  const handleResponseGoogle = async (response) => {
    const { credential } = response;
    if (credential) {
      await loginWithGoogle(credential);
      const { user, token } = await loginWithGoogle(credential);
      if (user && token) {
        setUser(user);
        setToken(token);
      }
    }
  };

  return (
    <>
      <Flex bg={"gray.200"} mb="4">
        <Spacer />
        <Box p="4">
          {!token ? (
            <GoogleOAuthProvider clientId={GoogleClientId}>
              <GoogleLogin
                onSuccess={handleResponseGoogle}
                onError={() => {
                  console.log("Login Failed");
                }}
                size="large"
                locale="vi_VN"
                // auto_select
                useOneTap
              ></GoogleLogin>
            </GoogleOAuthProvider>
          ) : (
            <Box>
              <Text as="b">{user?.name}</Text>
            </Box>
          )}
        </Box>
      </Flex>
    </>
  );
}
