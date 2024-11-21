import {
    Box,
    Flex,
    Spacer,
    Tag,
    TagLabel,
    Avatar,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from "@chakra-ui/react";
  import { AiOutlineUser } from "react-icons/ai";
  import { ChevronDownIcon } from "@chakra-ui/icons";
  import { Link, useNavigate } from "react-router-dom";
  import { useDispatch } from "react-redux";
  import { logout } from "@/redux/slices/AuthenticationSlice";
  import logo from "../../assets/image 2.png";
  
  const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const handleLogout = () => {
      dispatch(logout());
      navigate("/login");
    };
  
    return (
      <Box as="nav" bg="#252525" px={4} py={2} shadow="md" className="max-h-[58px]">
        <Flex alignItems="center">
          {/* Left: Logo */}
          <Box>
            <Link to="/dashboard">
              <img 
                src={logo} 
                alt="Company Logo" 
                width={250} 
                height={35} 
                style={{ height: "40px" }} 
              />
            </Link>
          </Box>
          
          <Spacer />
          
          {/* Right: Tag, Avatar, and Dropdown */}
          <Flex alignItems="center" gap={4}>
            {/* Tag */}
            <Tag size="lg" className="bg-white" borderRadius="full">
              <TagLabel>Hero</TagLabel>
            </Tag>
            
            {/* Avatar */}
            <Avatar 
              bg="white" 
              size="sm" 
              icon={<AiOutlineUser fontSize="1rem" className="text-black" />} 
            />
            
            {/* Dropdown Menu */}
            <Menu>
              <MenuButton>
                <Icon 
                  as={ChevronDownIcon} 
                  color="white" 
                  className="text-white" 
                  w={8} 
                  h={8} 
                />
              </MenuButton>
              <MenuList>
                {/* Changed to use MenuItem directly with styling */}
                <MenuItem
                  onClick={handleLogout}
                  bg="#404040"
                  color="white"
                  _hover={{ bg: "#404040", opacity: 0.85 }}
                  w="100%"
                  mx="auto"
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
    );
  };
  
  export default Navbar;