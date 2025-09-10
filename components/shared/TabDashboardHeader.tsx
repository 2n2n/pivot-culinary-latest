import { Tabs } from "expo-router";
import { Alert } from "react-native";
import { Search, Check, ChevronRight } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import PivotIcon from "@/components/SvgIcons/PivotIcon";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { useState } from "react";

const TabDashboardHeader = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("Chicago Bulls");
  return (
    <>
      <Tabs.Screen
        options={{
          title: "",
          headerShown: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <Text className="ml-5">
              <Icon as={PivotIcon} className="w-8 h-8" color="#F9832B" />
            </Text>
          ),
          headerRight: () => (
            <Box className="flex flex-row mr-5">
              <Button
                variant="link"
                onPress={() => Alert.alert("testing")}
                className="w-10 h-10 rounded-full p-0 items-center  justify-center"
              >
                <Icon as={Search} />
              </Button>
              {
                // TODO: Make profile image dynamic based on the active account.
              }
              <Button
                variant="link"
                onPress={() => setShowModal(true)}
                className="ml-3"
              >
                <Avatar>
                  <AvatarImage
                    alt="Chicago bulls"
                    source={{
                      uri: "data:image/png;base64,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",
                    }}
                  />
                </Avatar>
              </Button>
            </Box>
          ),
        }}
      />
      {/* MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Teams</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody className="p-4">
            {/* 
              // TODO: Identify the type of the accounts here.
            */}
            {[1, 2].map((val) => (
              <Button
                className="w-full h-auto flex flex-row items-center justify-between py-2 my-1"
                variant="link"
                onPress={() => {
                  // TODO: Handle team selection
                  console.log("press me", val);
                }}
              >
                <Box className="flex flex-row items-center">
                  <Avatar className="w-12 h-12 mr-3">
                    <AvatarImage
                      alt="Chicago Bulls"
                      source={{
                        uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAACzJJREFUeNrtWQtwVOUV/vbeu+/NvpJsHohpQsEQGiAlD0CBpGpSDAWtVFDpQAVBi1Y70hdTq44tsTroSC2lWqea1moVfACtiCAhEkBiUiISAiQkhDyAJLubfd999vw3S0hCUEioZDr+Myf/3T/3cb7zn8d37gW+Hl+PSxqRSCSGxDJwnR/kxOzHH398OUnVE0884R8pAEifWpp+Q/M7pFfHuXVugPImmt53Op2P0fzDEbYJSVVVVSqaf9V3kRtw0sPl5eVxZWVl7Fg9wgB4161bh3A4vJAMnXIBAFpkCq+sevEVCIIgXTDSAIx2+7Fz+3am3P2D7cBt9fX1sTG7DoDnpdAIjjAAslEhGepL32THi8ng/EAA83e/twXj3AF4PB72WznCABg8NjtCO/agq6srkV7P6AUQRVPQsb0MEZ8ImSglH8sISqHxNOnOHqvHBBEo37WLLRf13YEMr9drrK87iq1542BraWVr40eQ9aeePHkStR4Htl+XhLoDn7K1vL4AJh4+fBhTH12FJz/YjCZnN1u7kZDrR4D1ZTQ9sG3bNjzwz1dRcmA3kidIth3H/gjR85JPnTqFpUuXQiaTYfny5di/f79x6tSppXSDRbTmuowHMqNoSLRRA7FYCpEESHwsm9D9xEu8F3PjkpaWlkKLxYKiIslrYDQa2RTfF4A6EAhIyktokpNRU1ODvXv3zps+fXoD3egdWq6NKsAUM5PERuf46HEcu3dUedmXKMYAeaLiiooz+tsbBX4NSSbVJIEAYNGiRX2v7z0+B8DKUPl8PqhUKmlh9uzZ2LdvHzZs2GChurAiMTFRqg/sHCahUAiB443QurwIuz3wWm1wtJ+B2GWFiu7P+fwIkVG4qPkFhQIRhYAAx0GUgVcbDTFMBJ02ocmsxZi8HOh0OqjVagSDQUlJv9+PnJwc5Ofn9zMAx0me394XwKGsrCxJ4YKCgt4Tp02bJgm7mdvtli5kANm8bctWyJ8rhSAOlS6d7j1ypyZg8foXLukqZrhomq/oG8T74+Pjrc3NzYNXEHItZh2NRnMOPay79w1D+f4j4YwVjY2Nl3Tuxo0bUVhYyA5f6QUQDao/Tpo0CXv27LmkGzn2HLhimSZBDONYbe2XnldZWYmEhASYzeatpPOHAytxyeTJk2vY9nz00UdfeCPmTpG6+gt3iuMuWKsxDFLQ5fKBfgHX8YvvAIuJTZs2STPFQw2jEhf0A8Sxg8S13x0zZkw+gUjesmULqLhh9OjRvdnp3KAUC9NbH4DzB/pGFnaowjgdG4M6WQhNah5tcXp8HPFC1GlQExFhtZjQzIchUJDHBMP9I+IbSci6pajfWlNTEyoqKnDkyBEphaalpb1Gyz8gfey9RhskxSlo+hnJI+SXJqYsC2KlUomGhgZYrVa0Hj2GZe9X97suLPBolcso9wmQeX296/+J1SCry9PP+i4FD53b1+/6TyemIeaOOTjW3goDZUSqQUhJScG4cVK9spLcTYpvu2DXBwEwnaafkMyl4qY+ULYbzn1VaC/fB2XrGVioTiXzCvDuAWyb51BHntFI9YrXaaGgtNlts6FaCGOGoEWMIAcfIutTeh1NrDJWvAjZVSrQyoXhijdBn/dtaG7IxdiZ0zF+/HgWpwzArwnI5wPrwDnlc0VR/Phff3+da/vH29AdrEOqL4g4enDqeYfFUZWIXdogJoUETKOkDqmyyOBWy6miyaEg3i7rcmIUL6Bbq0aKXYQ76EKIjr1KAQ20m7Edbsn3G9UCNoedcEfCWAE9AfNjFHtMM3WNzR8A5KqfaxT4OCtdmfrLB+fdfPPNDPn8QQGwaiiXywPHd5Ypsz85DCEYGtRIf/FbUentxht0XGiw4BdBHXg6d4otJMVCQKdGJyegI+DHXtp5MKAlBgDjGEZZDbmTj1MYgfV7Ke6GxEMh6GgHuR7JhNi/Rc+k63VU7QuzJP428aLNvUUyJ0kDTlzZs+rgI9rq61DHC+HLBCUrHeMAtNWnI+JZxy4dsGt+LS6Gg2iG8dVMsyUacCHI9Ju8GIAMYEQWpUcNot2rBBM0HlpVwLng367VoY19maE6fy5c+cir82OxO/MxNnMsWjp7EC36EMHH8GplEQEHlqMZc8/E9ZqtavJfTZ8YQxEXWkWTetdLlcGq87UQIBRiezsbKmg/emW+TBmXIend/4bBw8elK7J1OjxmNyCOF+Pkh6iDSuDZ9DodaE4Jh6PELHlyBBhuYA35SL+bGvBOUazevVqmP/6NvLfK8WUnJxu6nsNHR09Lx6IxIVJadakP0rz3i8N4gGsMpckO0rgbCypsL753VdKFwdXrUHHj+9Eg8eJtWvX9iQYcoNcjRHxFOQVHhs6AyISlWq0+zyIU2swSq7GSb8Hdl9PApgyZQpuv/12xO6uRJjA3bdzszdK4lh/nsaSG0kdKd510T5zCPx8hsPhKF81IRt3OmUoU0ew5uwJaCg9eshFguEeH7aQ4g9pEjA5wOH3nAPljs5ekDNNCdjZ2YYJejNWGa5BvdOOiS+U4I6773qZlF12OfrwlwuAYqS5pKTktjpbZ+KJ6oOUMQR4tFRtKRBfNH8Tt8oNWKCJw5KwFtf6KTgpLgpCCiw0JqFYZcJSdTx4YrVHAh5815yEGLsTnanJWPnc04ztLqX7n74cfbgh0pfn5t+zBA5Bhlo+iAdFlZRJDssC0JFjx7tFKUX2HSqi3UkePz4PeUl8mE1gZjhDOGvUwvz9YlYod5P1D16uIkMF8EZqamp7ZnER5tmC0FPg3kDFiiOuUi0Pf+GFJ7UKyAlcJqdEMtWYjCCHe+6VvObZoSgyJABR9rouY8ViWFU9xGy8oEIncSc7OaUoDO6Z1Xo5Ml1BdAT9GCv0NE6K+bcgKSnpKB1u/coARMeG7NxcR/usKT19KhWbLq8bNzkj2KinqizvD6IyRg4vudlYXwhiiO1aEA4Cn3n/PZJLklHCXymAKCPcMOHhFeggRUxKFfQkGqrIC7sjqNZw2GVW4kO9gHeMAoyBMK539cRFqoFaacpY7qIZuC5jPEv4pUPVQxhmL/LMrIKC+9belKc3b6/ANQpK30STefLxGd2hi15kJkrBCl3ayh+xn+vJGEN+DzscF2K7wJL7k3N+9yjKDHLJr2v1SnwWp0W1SY3PLDGoTTSgiij1J2Y1iQo2InMJ5G4112cid+YMpvj64egw3B2Q3hrHxcXhEKXTLKLUEz20Aw73RaoOj0PEmxpVArjUJLbSFX1pgauyA9FR/Lfn/4CnumTIcPpRynmxVi0S5T5/a5fA4bdKDxbJbWgL+XEnsVbuLYlHMdpw29UG0GUxx0JJ7PN1uR+v2luxxX4aq7xtCEUz0WtE3nY4OtDSbcOz3jNE4iL4VkAmNT007FcbQK0u9VqEVUqkRwTIiSawVy+xxIUCPR9KpGZ/rN5ETRuPu3QWyIhenI03Ij09nf37wNWOgV2z8vNRSr49lWz5dkwaNZURqsohqLw9jcvigBL3BgRE1CZw7hCLfhjnFjKgn1EiaL7aAD4xGAzH+AVzxuGlTVKROqTmaEcEhGRyqVcO+QO0GwpoiA9NJ6p9Qsmj8F4phb403IcP24XIgqwvWTPv5z/Fe2lxaFZwmEkk7UariMIuHwrPejDbHsDcThFZEeoTqCKHli9k7nOCrnt5uM/nr8AOsG+4h/R6+aT04qL0VqMGp4mlNvncaKcM2U5t5Sm9Cm1jR8NbeD1Sl92NJQ+sDJD7LCDwx4dtwCv4IYK54xKSBSTs1YyGvU9ir+2j2UZ6V8V6eZIXSfnKK/Ll73/0VUUebQkt0Thjn3yaSGkrvh7/Z+O/+PJ96GbTM7IAAAAASUVORK5CYII=",
                      }}
                    />
                  </Avatar>
                  <Text className="text-lg font-bold">Chicago Bulls</Text>
                </Box>
                {selectedTeam === "Chicago Bulls" && (
                  <Icon as={Check} className="text-orange-500" size={20} />
                )}
              </Button>
            ))}
          </ModalBody>
          {/* // TODO: Identify the account type here. */}
          <ModalFooter className="p-4 border-t border-gray-200">
            <Button
              variant="link"
              className="flex flex-row items-center justify-between w-full mt-4"
              onPress={() => console.log("click profile")}
            >
              <Box className="flex flex-row items-center flex-1">
                <Avatar className="w-12 h-12 mr-3">
                  <AvatarImage
                    alt="Kali Mary"
                    source={{
                      uri: "data:image/png;base64,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",
                    }}
                  />
                </Avatar>
                <Box className="flex flex-col">
                  <Text className="text-lg font-bold text-black">
                    Kali Mary
                  </Text>
                  <Text className="text-sm text-black">kali@gmail.com</Text>
                  <Text className="text-sm text-black">+63 965 913 0375</Text>
                </Box>
              </Box>
              <Icon as={ChevronRight} className="text-gray-600" size={20} />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TabDashboardHeader;
