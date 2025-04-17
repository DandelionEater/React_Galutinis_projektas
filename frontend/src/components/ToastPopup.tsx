import { Toast } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

type ToastPopupProps = {
  message: string;
  show: boolean;
  onClose: () => void;
};

const ToastPopup = ({ message, show, onClose }: ToastPopupProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="position-fixed top-0 start-50 translate-middle-x p-3"
          style={{ zIndex: 1055 }}
          initial={{ opacity: 0, y: -100 }} // start off-screen above
          animate={{ opacity: 1, y: 0 }}    // slide in from the top
          exit={{ opacity: 0, y: -100 }}    // slide out to the top
          transition={{ duration: 0.5 }}    // duration of the animation
        >
          <Toast show={show} onClose={onClose} autohide delay={3000} className="rounded-3 shadow-sm">
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastPopup;
