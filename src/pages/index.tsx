import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Button, ModalFooter, Spacer, useDisclosure } from '@chakra-ui/react';
import { BsSend } from 'react-icons/bs'
import { AiOutlineSafetyCertificate } from 'react-icons/ai'
import Sidebar from '@/components/sidebar/Sidebar';
import {AspectRatio, Avatar, Box, Card, CardBody, Center, Flex, Grid, GridItem, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack,Text, } from '@chakra-ui/react'

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (comments:any) => {
    setSelectedFeedComments(comments);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
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


  const [feedsList, setfeedsList] = useState<any>([])
  const player = useRef<any>();
  const [isFilled, setIsFilled] = useState<Array<any>>(Array(feedsList.length).fill(false));
  const [comments, setComments] = useState<Array<any>>(Array(feedsList.length).fill(''));
  const [selectedFeedComments, setSelectedFeedComments] = useState<Array<any>>(Array(feedsList.length).fill(''));


  const handleComment = async (index:any) => {
    const data = {
      content: comments[index],
      feedsId: index,
      userId: user?.data.id
    }

    const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/feeds/createComment", data);

    const aComments = [...comments];
    aComments[index] = '';
    setComments(aComments);
    getAllFeeds();
  };
  
  const handleLike = async (index:any, postLike:any) => {
    const data = {
      feedsId: index,
      userId: user?.data.id
    }

    const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feeds/like/${index}/${user?.data.id}`);

    if(result.data === ""){
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/feeds/createLike", data);
    }else{
      const response = await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL + "/feeds/deleteLike", {data});
    }

    getAllFeeds();
    checkLikes();

  };

  useEffect(() => {
    getAllFeeds()
  }, []);


  const getAllFeeds = async () => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feeds`);
    setfeedsList(result.data)
  };

  const checkLikes = async () => {
    const updatedIsFilled = Array(feedsList.length).fill(false);
  
    for (let i in feedsList) {
      const likePost = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feeds/like/${feedsList[i].id}/${user?.data.id}`);
  
      if (likePost.data !== "") {
        updatedIsFilled[feedsList[i].id] = true;
      }
    }
  
    setIsFilled(updatedIsFilled);
  };
  
  useEffect(() => {
    checkLikes();
  }, [feedsList]);  

  const [subtitles, setSubtitles] = useState<string[]>([]);
  const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();

  const fetchSubtitles = async (e:any) => {
    const url = e;

    try {
      const response = await axios.get(url);
      const srtContent = response.data;

      setSubtitles(srtContent); 

      onOpenModal2()
    } catch (error) {
      console.error('Failed to fetch SRT file:', error);
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
              {feedsList.map((feed:any) => {
                return(
                  <>
                  <Card key={feed.id} w={{ base: "400px", md: "550px", lg: "700px" }} borderRadius='15' mt='10'>
                    <CardBody>
                      <Stack direction='row' alignItems="center" mb='5'>
                        <Avatar size='md' name={feed.user.username} />
                        <Stack spacing={0} direction='column'>
                          <Text fontSize="xl">{feed.user.username}</Text>
                        </Stack>
                        <Spacer />
                        {feed.issafe? (
                          <AiOutlineSafetyCertificate size={48}></AiOutlineSafetyCertificate>
                        ) : (
                          null
                        )}
                      </Stack>

                      <Text textAlign={'justify'} fontSize={24} mb="5"> 
                      {feed.title}
                      </Text>

                        {feed.sublink === null ? (
                          <ReactPlayer
                            ref={player}
                            url={feed.videolink}
                            width="100%"
                            height="100%"
                            style={{ maxWidth: '1280px' }}
                            controls={true}
                            
                          />
                        ) : (
                          <>
                          <ReactPlayer
                            ref={player}
                            url={feed.videolink}
                            width="100%"
                            height="100%"
                            style={{ maxWidth: '1280px' }}
                            controls={true}
                            
                          />
                          <Text mt={5} fontSize={25} cursor={'pointer'} onClick={() => fetchSubtitles(feed.sublink)}>Transkrip Subtitle</Text>

                          <Modal isOpen={isOpenModal2} onClose={onCloseModal2}>
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>Transkrip Subtitle</ModalHeader>
                              <ModalBody>
                                <Text>{subtitles}</Text>
                              </ModalBody>
                              <ModalFooter>
                                <Button onClick={onCloseModal2}>Close</Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                          </>
                        )}

                      <Stack direction='row' alignItems="center" mt='5' >
                        {isFilled[feed.id] === false || isFilled[feed.id] === undefined? (
                          <AiOutlineHeart size="36px" cursor='pointer' onClick={() => handleLike(feed.id, feed.likes)} />
                        ) : (
                          <AiFillHeart size="36px" color='red' cursor='pointer' onClick={() => handleLike(feed.id, feed.likes)}/>
                        )}
                        <Text as='b'>{feed.likes.length}</Text>
                      </Stack>

                      <Text cursor='pointer' mt='4' onClick={() => handleOpen(feed.comments)}>Lihat Semua Komentar</Text>
                      
                      <InputGroup display="flex" alignItems="center">
                        <Input
                          variant='unstyled'
                          placeholder='Tambahkan komentar ..'
                          size='lg'
                          mt='3'
                          
                          onChange={(e) => {
                            const newComments = [...comments];
                            newComments[feed.id] = e.target.value;
                            setComments(newComments);
                          }}
                          value={comments[feed.id]} // Menggunakan nilai komentar dari state sesuai indeks
                        />
                        <InputRightElement width="4.5rem" display="flex" justifyContent="center" alignItems="center" >
                            {comments[feed.id] !== '' && comments[feed.id] !== undefined  ? (
                            <BsSend cursor="pointer" onClick={() => handleComment(feed.id)} />
                            ) : (
                            <BsSend cursor="not-allowed" />
                            )}
                        </InputRightElement>
                      </InputGroup>

                      <Modal isOpen={isOpen} onClose={handleClose} size={'xl'}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Komentar</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        
                        {selectedFeedComments.map((komen:any, indeks:number) => (
                        <>
                            <Stack key={indeks} alignItems="flex-start" mb='5'>
                                <Text as='b' textAlign="left">{komen.user.username}</Text>
                                <Text textAlign="justify">{komen.content}</Text>
                            </Stack>
                        </>
                        ))}
                            </ModalBody>
                        </ModalContent>
                      </Modal>
                      
                    </CardBody>
                  </Card>
                  </>
                )
              })}
                
              </Stack>
            </Center>
          </GridItem>
          
        </Grid>
        </>
      )}
    </>
  );
}
