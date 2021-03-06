import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useCurrentUserQuery } from "../generated/graphql";

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data, fetching }] = useCurrentUserQuery();

  let navItems;

  if (fetching) {
    // Loading
    navItems = (
      <>
        <NextLink href="/login" passHref>
          <NavLink>Login</NavLink>
        </NextLink>
        <NextLink href="/register" passHref>
          <NavLink>Sign up</NavLink>
        </NextLink>
      </>
    );
  } else if (data?.currentUser) {
    // User logged
    navItems = (
      <Menu>
        <MenuButton
          as={Button}
          rounded={"full"}
          variant={"link"}
          cursor={"pointer"}
          minW={0}
        >
          <Avatar
            size={"sm"}
            src={"https://avatars.dicebear.com/api/male/username.svg"}
          />
        </MenuButton>
        <MenuList alignItems={"center"}>
          <br />
          <Center>
            <Avatar
              size={"2xl"}
              src={"https://avatars.dicebear.com/api/male/username.svg"}
            />
          </Center>
          <br />
          <Center>
            <p>{data.currentUser.username}</p>
          </Center>
          <br />
          <MenuDivider />
          <MenuItem>Your Servers</MenuItem>
          <MenuItem>Account Settings</MenuItem>
          <MenuItem>Logout</MenuItem>
        </MenuList>
      </Menu>
    );
  } else {
    // User not logged
    navItems = (
      <>
        <NextLink href="/login" passHref>
          <NavLink>Login</NavLink>
        </NextLink>
        <NextLink href="/register" passHref>
          <NavLink>Sign up</NavLink>
        </NextLink>
      </>
    );
  }
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex
          maxWidth={"7xl"}
          width={"100%"}
          mx={"auto"}
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box>Logo</Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={4}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              {navItems}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
