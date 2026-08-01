import { Modal } from "../../Modal";
import TestimonialItem from "../Testimonals/TestimonalItem";
import { type testimonals } from "../../constants/testimonals";

type Testimonial = (typeof testimonals)[number];

export function TestimonialModal({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={!!testimonial}
      onClose={onClose}
      title={testimonial ? testimonial.name : "Testimonial"}
      style={{ maxWidth: "680px" }}
    >
      {testimonial && (
        <TestimonialItem
          name={testimonial.name}
          job={testimonial.job}
          post={testimonial.post}
          significant={testimonial.significant}
        />
      )}
    </Modal>
  );
}
