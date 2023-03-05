import { Flex, Box, Spacer, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  GoogleClientId,
  loginWithGoogle,
  setHeaderAuthorization,
  getMe,
} from "@/shared/api";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useUserStore } from "@/shared/user.store";

export default function Navbar() {
  let [token, setToken] = useState("");
  let [user, setUser] = useState({});
  const setUserStore = useUserStore((state) => state.setUserStore);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUserStore(user);
    }
  }, [user]);

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
      try {
        const { user, token } = await loginWithGoogle(credential);
        if (user && token) {
          setHeaderAuthorization(token);
          setUser(user);
          setToken(token);
        }
      } catch (error) {
        console.error("🚀 ~ error:", error);
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
