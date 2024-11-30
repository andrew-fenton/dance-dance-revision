import cv2

def main():
    # access webcam
    cap = cv2.VideoCapture(0)
   
    while True:
        # pull frame
        ret, frame = cap.read()
        # mirror frame
        frame = cv2.flip(frame, 1)
        # display frame
        cv2.imshow('frame',frame)
        if cv2.waitKey(1) == ord('q'):
            break

    # release everything
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
   main()
