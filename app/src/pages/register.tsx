import React from "react";
import { Form, Formik } from "formik";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import InputField from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Flex justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={8} mx={"auto"} w="100%" maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign up</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={async (value, { setErrors }) => {
                const response = await register(value);
                if (response.data?.register.errors) {
                  setErrors(toErrorMap(response.data.register.errors));
                } else if (response.data?.register.user) {
                  router.push("/");
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    name="username"
                    label="Username"
                    placeholder="Username"
                  />
                  <InputField
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                  />
                  <Stack pt={6}>
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="Submitting"
                      size="lg"
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "blue.500",
                      }}
                    >
                      Sign up
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>

            <Stack pt={6}>
              <Text align={"center"}>
                <Link color={"blue.400"}>Already a user? </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;
