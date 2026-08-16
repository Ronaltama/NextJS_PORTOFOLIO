// Quote.js
import "./style.css";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "./useIntersectionObserver";
import ProfileData from "@/json/profile.json";

function Wrapper({ children }) {
	return (
		<div className="min-h-[80vh] mx-auto container p-10 grid grid-cols-1 mt-10">
			<motion.div
				className="flex justify-center items-center flex-col mb-5"
				initial={{ opacity: 0, scale: 0.9 }}
				whileInView={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.6, duration: 2, ease: [0.22, 1, 0.36, 1] }}>
				{children}
			</motion.div>
		</div>
	);
}

export default function Quote() {
	const prof = ProfileData.Profile || {};
	const line1Text = prof.quoteLine1 ? `"${prof.quoteLine1}` : '"There are no limits to what you can accomplish';
	const line2Text = prof.quoteLine2 ? `${prof.quoteLine2}"` : 'except the limits you place on your own thinking."';

	const text1 = line1Text.split(" ");
	const text2 = line2Text.split(" ");
	const [ref, isIntersecting] = useIntersectionObserver();

	return (
		<Wrapper>
			<div ref={ref} className="text-center">
				<h3 className="text-[2rem]">
					{text1.map((word, index) => (
						<motion.span
							key={index}
							initial={{ opacity: 0, filter: "blur(4px)", scale: 0.92 }}
							animate={{
								opacity: isIntersecting ? 1 : 0,
								filter: isIntersecting ? "blur(0px)" : "blur(4px)",
								scale: isIntersecting ? 1 : 0.92,
							}}
							transition={{ delay: isIntersecting ? index * 0.1 : 0, duration: 0.5 }}>
							{word}{" "}
						</motion.span>
					))}
				</h3>
				<h3 className="text-[2rem] text-gray-500">
					{text2.map((word, index) => (
						<motion.span
							key={index}
							initial={{ opacity: 0, filter: "blur(4px)", scale: 0.92 }}
							animate={{
								opacity: isIntersecting ? 1 : 0,
								filter: isIntersecting ? "blur(0px)" : "blur(4px)",
								scale: isIntersecting ? 1 : 0.92,
							}}
							transition={{ delay: isIntersecting ? index * 0.1 + text1.length * 0.1 : 0, duration: 0.5 }}>
							{word}{" "}
						</motion.span>
					))}
				</h3>
			</div>
		</Wrapper>
	);
}
