import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import { Card, CardBody, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Stack } from '@chakra-ui/react';

export default function Edit() {
    const [sliderValue, setSliderValue] = useState(0);
    const [videoDuration, setVideoDuration] = useState(4);

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <Card w="70%">
                    <CardBody className="flex items-center justify-center">
                        <Stack direction="column" className="flex items-center justify-center">
                            <video src={`https://cdn.discordapp.com/attachments/933624790953119837/1101877044469571736/ryan_odin.mp4#t=2,3`} className="w-4/5" controls>
                            </video>
                            <Slider w="80%" aria-label='slider-ex-1' defaultValue={0} onChange={(v) => setSliderValue(v)}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Stack>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}