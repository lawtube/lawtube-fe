import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Sidebar from '@/components/sidebar/Sidebar';
import {AspectRatio, Avatar, Box, Card, CardBody, Center, Flex, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack,Text, } from '@chakra-ui/react'

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isFilled, setIsFilled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsFilled(!isFilled);
  };

  useEffect(() => {
    const auth = localStorage.getItem("Authorization");
    if (!auth || auth==="") {
      router.push('/auth/login');
    } else {
      getUserDetail(auth);
    }
  }, [router]);
 
  const getUserDetail = async (auth: any) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
        headers: {
          Authorization: auth,
        },
      });
      setUser(response.data);
     
    } catch (error) {
      console.error(error);

    }
  };

  return (
    <>
      {user && (
        <>
        <Grid >

          <GridItem>
            <Center >

              <Stack direction='column' spacing={8}>
                <Card w={{ base: "400px", md: "550px", lg: "700px" }} borderRadius='15' mt='10'>
                  <CardBody>
                    <Stack direction='row' alignItems="center" mb='5'>
                      <Avatar size='md' name='Teuku Faiz' />
                      <Stack spacing={0} direction='column'>
                        <Text fontSize="xl">Teuku Faiz</Text>
                      </Stack>
                    </Stack>

                    <Text textAlign={'justify'}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </Text>

                    <Flex justifyContent="center" alignItems="center" mt="5">
                      <AspectRatio maxW='1280px' ratio={1} w="100%" h="100%">
                        <iframe
                          title='naruto'
                          src='https://www.youtube.com/embed/QhBnZ6NPOY0'
                          allowFullScreen
                        />
                      </AspectRatio>
                    </Flex>

                    <Stack direction='row' alignItems="center" mt='5' >
                      {isFilled ? (
                        <AiFillHeart size="36px" color='red' cursor='pointer' onClick={handleClick}/>
                      ) : (
                        <AiOutlineHeart size="36px" cursor='pointer' onClick={handleClick} />
                      )}
                      <Text as='b'>6969 Likes</Text>
                    </Stack>
                    <Text cursor='pointer' mt='2' onClick={handleOpen}>Lihat Semua Komentar</Text>
                    <Input variant='unstyled' placeholder='Tambahkan komentar ..' size='lg' mt='3'/>

                    <Modal isOpen={isOpen} onClose={handleClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Komentar</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          {/* Put your comment section code here */}
                        </ModalBody>
                      </ModalContent>
                    </Modal>

                  </CardBody>
                </Card>

                <Card w={{ base: "400px", md: "550px", lg: "700px" }} borderRadius='15' mt='10'>
                  <CardBody>
                    <Stack direction='row' alignItems="center" mb='5'>
                      <Avatar size='md' name='Teuku Faiz' />
                      <Stack spacing={0} direction='column'>
                        <Text fontSize="xl">Teuku Faiz</Text>
                      </Stack>
                    </Stack>

                    <Text textAlign={'justify'}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Text>

                    <Flex justifyContent="center" alignItems="center" mt="5">
                      <AspectRatio maxW='1280px' ratio={1} w="100%" h="100%">
                        <iframe
                          title='naruto'
                          src='https://www.youtube.com/embed/QdpdsXKqN4E?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=http://youtubeembedcode.com'
                          allowFullScreen
                        />
                      </AspectRatio>
                    </Flex>

                    <Stack direction='row' alignItems="center" mt='5' >
                      {isFilled ? (
                        <AiFillHeart size="36px" color='red' cursor='pointer' onClick={handleClick}/>
                      ) : (
                        <AiOutlineHeart size="36px" cursor='pointer' onClick={handleClick} />
                      )}
                      <Text as='b'>9696 Likes</Text>
                    </Stack>
                    <Text cursor='pointer' mt='2' onClick={handleOpen}>Lihat Semua Komentar</Text>
                    <Input variant='unstyled' placeholder='Tambahkan komentar ..' size='lg' mt='3'/>

                    <Modal isOpen={isOpen} onClose={handleClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Komentar</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Stack direction='row' alignItems="center" mb='5'>
                            <Text as='b'>Teuku Faiz</Text>
                            <Text>Tired of the unpredictability and complexity of trading? Let AI do the heavy lifting for you with Market Dynamics. Our platform empowers traders of all levels of experience to create fully automated trading strategies, using a simple and intuitive visual approach.</Text>
                          </Stack>
                          <Stack direction='row' alignItems="center" mb='5'>
                            <Text as='b'>Asrap</Text>
                            <Text>Transform Your Trading with Market Dynamics!</Text>
                          </Stack>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                    
                  </CardBody>
                </Card>

              </Stack>
            </Center>
          </GridItem>



          
        </Grid>
        </>
      )}
    </>
  );
}
