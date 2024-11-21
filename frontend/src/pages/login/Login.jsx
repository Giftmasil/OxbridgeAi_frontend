import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import AuthLayout from "../../components/components/authLayout";
import loginImage from "../../assets/oxbridgeAI.jpeg"; // Replace with your image path

const LoginPage = ({ setIsAuthenticated, setRole }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Login Failed",
        description: "Please provide both email and password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    const loginUrl = email.includes("admin")
      ? "https://backend-j7ru.onrender.com/api/v1/admin/login"
      : "https://backend-j7ru.onrender.com/api/v1/judge/login";

    try {
      const response = await axios.post(
        loginUrl,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, role } = response.data;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      setRole(role);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${role}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate(role === "admin" ? "/admin-dashboard" : "/judge-dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          error.response?.data?.message || "Invalid email or password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout imageUrl={loginImage}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Log In
        </Text>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          color="white"
          bg="black"
          size="lg"
          width="100%"
          onClick={handleLogin}
          isLoading={isLoading}
        >
          Log In
        </Button>
        <Text fontSize="sm" textAlign="center">
          Don&apos;t have an account?{" "}
          <Link color="blue.500" href="/signup">
            Sign up
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

LoginPage.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired,
};

export default LoginPage;
