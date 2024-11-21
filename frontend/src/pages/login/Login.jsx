import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
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
import { login } from "@/redux/slices/AuthenticationSlice";
import AuthLayout from "../../components/components/authLayout";
import loginImage from "../../assets/oxbridgeAI.jpeg";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error } = useSelector((state) => state.auth);

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

    try {
      const resultAction = await dispatch(login({ email, password })).unwrap();
      
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate(resultAction.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      toast({
        title: "Login Failed",
        description: err.message || "Please check your credentials and try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      handleLogin();
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
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <Button
          color="white"
          bg="black"
          _hover={{ bg: "gray.800" }}
          size="lg"
          width="100%"
          onClick={handleLogin}
          isLoading={loading}
        >
          Log In
        </Button>
        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}
        <Text fontSize="sm" textAlign="center">
          Don&apos;t have an account?{" "}
          <Link color="blue.500" href="#/signup">
            Sign up
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default LoginPage;