import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Shield, Users, CheckCircle2, 
  Terminal, Paintbrush, Rocket, Sun, Moon, Globe, 
  ChevronDown, Layers, Mail
} from 'lucide-react';
import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { HoverPreview } from '../components/ui/hover-preview'; // Adjust path if needed

// ------------------------------------------------------------------
// Safe SVG Path Constants (Prevents Vite/OXC Parsing Errors)
// ------------------------------------------------------------------
const ICONS = {
  customizable: "M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z",
  secure_main: "M44.0209 55.3542C43.1945 54.7639 42.6916 54.0272 42.5121 53.1442C42.3327 52.2611 42.5995 51.345 43.3125 50.3958C50.632 40.3611 59.812 32.5694 70.8525 27.0208C81.8931 21.4722 93.668 18.6979 106.177 18.6979C118.691 18.6979 130.497 21.3849 141.594 26.7587C152.691 32.1326 161.958 39.8936 169.396 50.0417C170.222 51.1042 170.489 52.0486 170.196 52.875C169.904 53.7014 169.401 54.4097 168.688 55C167.979 55.5903 167.153 55.8571 166.208 55.8004C165.264 55.7437 164.438 55.2408 163.729 54.2917C157.236 45.0833 148.885 38.0307 138.675 33.1337C128.466 28.2368 117.633 25.786 106.177 25.7812C94.7257 25.7812 83.9827 28.2321 73.948 33.1337C63.9132 38.0354 55.5903 45.0881 48.9792 54.2917C48.2709 55.3542 47.4445 55.9444 46.5 56.0625C45.5556 56.1806 44.7292 55.9444 44.0209 55.3542ZM126.188 142.656C113.91 139.587 103.875 133.476 96.0834 124.325C88.2917 115.173 84.3959 103.988 84.3959 90.7708C84.3959 84.8681 86.5209 79.9097 90.7709 75.8958C95.0209 71.8819 100.156 69.875 106.177 69.875C112.198 69.875 117.333 71.8819 121.583 75.8958C125.833 79.9097 127.958 84.8681 127.958 90.7708C127.958 94.6667 129.434 97.9439 132.385 100.602C135.337 103.261 138.819 104.588 142.833 104.583C146.847 104.583 150.271 103.256 153.104 100.602C155.938 97.9486 157.354 94.6714 157.354 90.7708C157.354 77.0764 152.337 65.566 142.302 56.2396C132.267 46.9132 120.285 42.25 106.354 42.25C92.4237 42.25 80.441 46.9132 70.4063 56.2396C60.3716 65.566 55.3542 77.0174 55.3542 90.5937C55.3542 93.4271 55.621 96.9687 56.1546 101.219C56.6882 105.469 57.9562 110.427 59.9584 116.094C60.3125 117.156 60.2842 118.101 59.8734 118.927C59.4625 119.753 58.7825 120.344 57.8334 120.698C56.8889 121.052 55.9752 121.024 55.0921 120.613C54.2091 120.202 53.5881 119.522 53.2292 118.573C51.4584 113.969 50.1905 109.395 49.4255 104.853C48.6605 100.31 48.2756 95.6158 48.2709 90.7708C48.2709 75.0694 53.9682 61.9062 65.363 51.2812C76.7577 40.6562 90.3624 35.3437 106.177 35.3437C122.115 35.3437 135.809 40.6562 147.26 51.2812C158.712 61.9062 164.438 75.0694 164.438 90.7708C164.438 96.6736 162.343 101.601 158.155 105.554C153.966 109.506 148.859 111.485 142.833 111.49C136.813 111.49 131.649 109.513 127.342 105.561C123.035 101.608 120.88 96.6783 120.875 90.7708C120.875 86.875 119.43 83.5978 116.54 80.9392C113.65 78.2805 110.196 76.9536 106.177 76.9583C102.163 76.9583 98.7089 78.2876 95.8142 80.9462C92.9195 83.6049 91.4745 86.8797 91.4792 90.7708C91.4792 102.222 94.8745 111.785 101.665 119.458C108.456 127.132 117.22 132.503 127.958 135.573C129.021 135.927 129.729 136.517 130.083 137.344C130.438 138.17 130.497 139.056 130.26 140C130.024 140.826 129.552 141.535 128.844 142.125C128.135 142.715 127.25 142.892 126.188 142.656ZM67.0417 18.3437C66.0973 18.934 65.1528 19.0828 64.2084 18.79C63.2639 18.4972 62.5556 17.8762 62.0834 16.9271C61.6112 15.9826 61.4931 15.1279 61.7292 14.3629C61.9653 13.5979 62.5556 12.9179 63.5 12.3229C70.1112 8.78125 77.0174 6.06597 84.2188 4.17708C91.4202 2.28819 98.7396 1.34375 106.177 1.34375C113.733 1.34375 121.111 2.25986 128.313 4.09208C135.514 5.92431 142.479 8.54986 149.208 11.9687C150.271 12.559 150.892 13.2674 151.071 14.0937C151.251 14.9201 151.161 15.7465 150.802 16.5729C150.448 17.3993 149.858 18.0486 149.031 18.5208C148.205 18.9931 147.201 18.934 146.021 18.3437C139.764 15.1563 133.299 12.7078 126.627 10.9983C119.954 9.28889 113.138 8.43181 106.177 8.42708C99.3299 8.42708 92.6007 9.22514 85.9896 10.8212C79.3785 12.4174 73.0625 14.9249 67.0417 18.3437ZM87.9375 140.177C80.9723 132.858 75.6314 125.392 71.915 117.78C68.1987 110.167 66.3381 101.164 66.3334 90.7708C66.3334 80.0278 70.2292 70.9658 78.0209 63.585C85.8125 56.2042 95.198 52.5161 106.177 52.5208C117.156 52.5208 126.601 56.2112 134.51 63.5921C142.42 70.9729 146.375 80.0325 146.375 90.7708C146.375 91.8333 146.052 92.6904 145.405 93.3421C144.758 93.9937 143.901 94.3172 142.833 94.3125C141.889 94.3125 141.063 93.989 140.354 93.3421C139.646 92.6951 139.292 91.8381 139.292 90.7708C139.292 81.9167 136.014 74.5099 129.46 68.5504C122.906 62.591 115.145 59.6089 106.177 59.6042C97.2049 59.6042 89.503 62.5862 83.0713 68.5504C76.6396 74.5146 73.4214 81.9214 73.4167 90.7708C73.4167 100.333 75.0695 108.451 78.375 115.123C81.6806 121.796 86.5209 128.494 92.8959 135.219C93.6042 135.927 93.9584 136.753 93.9584 137.698C93.9584 138.642 93.6042 139.469 92.8959 140.177C92.1875 140.885 91.3612 141.24 90.4167 141.24C89.4723 141.24 88.6459 140.885 87.9375 140.177ZM141.417 128.135C130.91 128.135 121.789 124.594 114.054 117.51C106.319 110.427 102.454 101.514 102.458 90.7708C102.458 89.8264 102.784 89 103.436 88.2917C104.088 87.5833 104.942 87.2292 106 87.2292C107.063 87.2292 107.92 87.5833 108.571 88.2917C109.223 89 109.546 89.8264 109.542 90.7708C109.542 99.625 112.729 106.885 119.104 112.552C125.479 118.219 132.917 121.052 141.417 121.052C142.125 121.052 143.129 120.993 144.427 120.875C145.726 120.757 147.083 120.58 148.5 120.344C149.563 120.108 150.479 120.256 151.248 120.79C152.018 121.324 152.519 122.119 152.75 123.177C152.986 124.122 152.809 124.948 152.219 125.656C151.629 126.365 150.861 126.837 149.917 127.073C147.792 127.663 145.934 127.989 144.342 128.05C142.751 128.112 141.776 128.14 141.417 128.135Z",
  faster_1: "M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123",
  faster_2: "M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605",
  trust_1: "M0.148438 231V179.394L1.92188 180.322L2.94482 177.73L4.05663 183.933L6.77197 178.991L7.42505 184.284L9.42944 187.985L11.1128 191.306V155.455L13.6438 153.03V145.122L14.2197 142.829V150.454V154.842L15.5923 160.829L17.0793 172.215H19.2031V158.182L20.7441 153.03L22.426 148.111V142.407L24.7471 146.86V128.414L26.7725 129.918V120.916L28.1492 118.521L28.4653 127.438L29.1801 123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988V148.111L123.4 152.613L125.401 158.182L130.547 150.454V156.566L131.578 155.455L134.143 158.182L135.594 168.136L138.329 158.182L140.612 160.829L144.681 169.5L147.011 155.455L148.478 151.787L151.02 152.613L154.886 145.122L158 143.412L159.406 140.637L159.496 133.348L162.295 127.87V122.082L163.855 116.645V109.729L164.83 104.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.308 82.3223L333.525 52.7986L334.097 52.145L334.735 55.6812L337.369 59.8108V73.676L340.743 87.9656L343.843 96.3728L348.594 82.7747L349.607 81.045L351 89.7556L352.611 96.3728L355.149 94.9932L356.688 102.176L359.396 108.784L360.684 111.757L365 95.7607V231H148.478H0.148438Z",
  trust_2: "M1 179.796L4.05663 172.195V183.933L7.20122 174.398L8.45592 183.933L10.0546 186.948V155.455L12.6353 152.613V145.122L15.3021 134.71V149.804V155.455L16.6916 160.829L18.1222 172.195V158.182L19.8001 152.613L21.4105 148.111V137.548L23.6863 142.407V126.049L25.7658 127.87V120.525L27.2755 118.066L29.1801 112.407V123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988L121.501 148.111L123.4 152.613L125.401 158.182L127.992 152.613L131.578 146.76V155.455L134.143 158.182L135.818 164.629L138.329 158.182L140.612 160.829L144.117 166.757L146.118 155.455L147.823 149.804L151.02 152.613L154.886 145.122L158.496 140.988V133.348L161.295 127.87V122.082L162.855 116.645V109.729L164.83 103.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.357 74.9864L332.611 52.6565L334.352 48.5552L335.785 55.2637L338.377 59.5888V73.426L341.699 87.5181L343.843 93.4347L347.714 82.1171L350.229 78.6821L351.974 89.7556L353.323 94.9932L355.821 93.4347L357.799 102.127L360.684 108.794L363.219 98.004L365 89.7556"
};

// ------------------------------------------------------------------
// Base Animation Config
// ------------------------------------------------------------------
const spring = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-2xl transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`p-8 lg:p-10 ${className}`}>{children}</div>
);

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
export default function CollabHubLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true); 
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored === 'light' ? false : true; 
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Background Architectural Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Floating Navbar */}
      <header className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
        <nav className={`pointer-events-auto w-full max-w-6xl transition-all duration-500 rounded-full border ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-zinc-200 dark:border-white/10 shadow-lg' : 'bg-transparent border-transparent'} px-4 py-2.5 flex items-center justify-between`}>
          <Link to="/" className="flex items-center gap-2 group ml-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
              <Sparkles className="text-white dark:text-black w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-lg hidden sm:block text-zinc-900 dark:text-white">CollabHub</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Platform</a>
            <a href="#network" className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Network</a>
            <a href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">FAQ</a>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors hidden sm:block cursor-pointer">Log in</Link>
            <Link to="/register" className="h-10 inline-flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white px-5 text-sm font-bold text-white dark:text-black shadow transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section ref={heroRef} className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden flex flex-col items-center">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20 dark:opacity-[0.15] pointer-events-none">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center relative z-10">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }} className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter leading-[0.95] text-center mb-8 text-zinc-900 dark:text-white">
              The network for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-400 dark:from-white dark:to-zinc-500">
                builders who ship.
              </span>
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }} className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto text-center mb-12 text-balance leading-relaxed font-medium">
              Stop swiping through generic job boards. Connect instantly with top-tier engineers, designers, and founders through our deterministic matching engine.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4 mb-24 w-full sm:w-auto">
              <Link to="/register" className="group relative h-14 inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-8 rounded-full overflow-hidden w-full sm:w-auto transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)] cursor-pointer">
                <span className="relative z-10 flex items-center gap-2">
                  Create Builder Profile <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-cyan-600 dark:bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </motion.div>

            {/* Interactive Hero Visual */}
            <motion.div style={{ y: heroY, opacity: heroOpacity }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.5 }} className="relative w-full max-w-5xl mx-auto hidden md:block perspective-[1000px]">
              <div className="relative rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden p-12">
                <div className="absolute top-5 left-5 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
                
                <div className="mt-6 flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-zinc-200 dark:bg-white/10 -translate-y-1/2 overflow-hidden">
                    <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-[2px]" />
                  </div>

                  <div className="w-80 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] p-6 shadow-xl relative z-10 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Dev" className="w-14 h-14 rounded-full border border-zinc-200 dark:border-zinc-800" />
                      <div>
                        <div className="font-bold text-lg text-zinc-900 dark:text-white">Alex Chen</div>
                        <div className="text-sm text-cyan-600 dark:text-cyan-400 font-mono tracking-tight">Senior Fullstack</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">React</span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">Node.js</span>
                    </div>
                  </div>

                  <div className="relative z-10 w-20 h-20 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-black shadow-2xl flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-20" />
                    <Sparkles className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                  </div>

                  <div className="w-80 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] p-6 shadow-xl relative z-10 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Designer" className="w-14 h-14 rounded-full border border-zinc-200 dark:border-zinc-800" />
                      <div>
                        <div className="font-bold text-lg text-zinc-900 dark:text-white">Sarah Jenkins</div>
                        <div className="text-sm text-cyan-600 dark:text-cyan-400 font-mono tracking-tight">Product / UI</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">Figma</span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">Strategy</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Global Logos */}
        <div className="py-12 border-y border-zinc-200 dark:border-white/5 bg-zinc-100/50 dark:bg-white/[0.02] overflow-hidden">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">Trusted by builders at top companies</p>
          <div className="flex animate-marquee whitespace-nowrap gap-24 items-center opacity-40 grayscale">
            {Array(4).fill(['STRIPE', 'VERCEL', 'LINEAR', 'GITHUB', 'SUPABASE', 'NOTION']).flat().map((text, i) => (
              <span key={i} className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-300 px-12">
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Roles Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Terminal, title: "For Engineers", desc: "Find designers and founders with validated ideas. Stop building things nobody wants." },
                { icon: Paintbrush, title: "For Designers", desc: "Partner with devs who can actually build your Figma files. Build your portfolio with real products." },
                { icon: Rocket, title: "For Founders", desc: "Stop paying massive agency fees. Find technical co-founders who believe in your vision." }
              ].map((role, i) => (
                <div key={i} className="group p-8 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6">
                    <role.icon className="w-5 h-5 text-zinc-900 dark:text-white group-hover:text-cyan-500 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">{role.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features-8 Component */}
        <FeaturesSection />

        {/* Workflow Timeline */}
        <section className="py-32 relative">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="mb-24 md:text-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-900 dark:text-white">Execution over networking.</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl font-medium text-balance mx-auto max-w-2xl">
                The fastest path from an empty repository to a launched product.
              </p>
            </div>
            
            <div className="space-y-16 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-zinc-300 dark:before:via-zinc-800 before:to-transparent">
              {[
                { step: "01", icon: GitHubLogoIcon, title: "Initialize Identity", desc: "Connect GitHub/Figma. Our engine analyzes your real commits and layers, not just your resume text." },
                { step: "02", icon: Layers, title: "Deterministic Matching", desc: "Set your parameters. We run the algorithm to find partners with complementary skills and matching commitment levels." },
                { step: "03", icon: Rocket, title: "Deploy Together", desc: "One click sets up your shared workspace, repo, and chat. Skip the small talk. Start committing." }
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-pointer">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-[#0A0A0A] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                    <item.icon size={18} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-md group-hover:border-zinc-300 dark:group-hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-sm">
                    <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white flex items-center gap-3">
                      <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">{item.step}</span>
                      {item.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HoverPreview Showcase Integration */}
        <section className="py-20 relative max-w-6xl mx-auto px-6 lg:px-8">
            <HoverPreview />
        </section>

        {/* Minimalist Testimonials */}
        <TestimonialsSection />

        {/* Polished FAQ Section */}
        <section id="faq" className="py-32 relative max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4 font-medium text-lg">Clear answers to your most pressing questions.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "How is this different from LinkedIn?", a: "LinkedIn is for resumes. CollabHub connects directly to your GitHub or Figma, matching you based on verified skills and real output, not self-proclaimed titles." },
              { q: "Is the matching really deterministic?", a: "Yes. We use a proprietary algorithm that scores compatibility based on tech stack intersection, timezone overlap, and commitment bandwidth." },
              { q: "Who owns the IP of what we build?", a: "You do. CollabHub provides the connection and workspace. IP agreements are handled directly between collaborators via our standard template integration." }
            ].map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* Stark Final CTA */}
        <section className="py-32 px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-[3rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] py-24 px-8 text-center overflow-hidden shadow-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500 rounded-full blur-[150px] opacity-10 pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter mb-8 text-zinc-900 dark:text-white leading-[0.9]">
                  Ready to ship?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/register" className="h-16 inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-10 rounded-full hover:scale-105 transition-transform w-full sm:w-auto shadow-xl cursor-pointer">
                    Create Builder Profile
                    <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-500"/> Instant matching</span>
                  <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-500"/> Powerful tools</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Revamped "Fat Footer" */}
      <footer className="border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black pt-24 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-5">
              <Link to="/" className="flex items-center gap-3 mb-8 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="font-bold tracking-tighter text-2xl text-zinc-900 dark:text-white">CollabHub</span>
              </Link>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-sm mb-8 text-lg">
                The deterministic matching engine for ambitious builders. Find your team, launch products, and shape the future.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-cyan-500 transition-colors cursor-pointer"><TwitterLogoIcon size={20} /></a>
                <a href="#" className="p-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-cyan-500 transition-colors cursor-pointer"><GitHubLogoIcon size={20} /></a>
                <a href="#" className="p-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-cyan-500 transition-colors cursor-pointer"><LinkedInLogoIcon size={20} /></a>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-bold text-zinc-900 dark:text-white mb-6 text-sm">Product</h4>
              <ul className="space-y-4 text-zinc-600 dark:text-zinc-400 font-medium">
                <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">Platform</a></li>
                <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">Integrations</a></li>
                <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">Changelog</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-bold text-zinc-900 dark:text-white mb-6 text-sm">Resources</h4>
              <ul className="space-y-4 text-zinc-600 dark:text-zinc-400 font-medium">
                <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">Docs</a></li>
                <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">Community</a></li>
                <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">Blog</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-3">
              <h4 className="font-bold text-zinc-900 dark:text-white mb-6 text-sm">Join the Insider List</h4>
              <form className="flex flex-col gap-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input type="email" placeholder="Email address" className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 dark:focus:border-cyan-500 transition-all shadow-sm" />
                </div>
                <button type="submit" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-xl text-sm font-bold hover:scale-[1.02] transition-transform cursor-pointer shadow-md">Subscribe</button>
              </form>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-zinc-200 dark:border-white/10 pt-8 text-sm text-zinc-500 dark:text-zinc-500 font-medium">
            <div>© {new Date().getFullYear()} CollabHub Inc. All rights reserved.</div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Large watermark */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-[15vw] font-black tracking-tighter text-zinc-100 dark:text-white/[0.02] pointer-events-none select-none z-0 whitespace-nowrap">
          COLLABHUB
        </div>
      </footer>
    </div>
  );
}

// ------------------------------------------------------------------
// FAQ Item Component
// ------------------------------------------------------------------
function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      onClick={() => setIsOpen(!isOpen)} 
      className={`p-6 rounded-2xl border transition-all cursor-pointer ${isOpen ? 'border-cyan-500/50 bg-cyan-50/30 dark:bg-cyan-900/10' : 'border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-zinc-900 dark:text-white">{q}</h4>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------------------------------
// Features-8
// ------------------------------------------------------------------
function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 bg-zinc-50 dark:bg-[#0A0A0A] border-y border-zinc-200 dark:border-white/10" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-900 dark:text-white">Engineered for collaboration.</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Everything required to find the right people and start building. Secure, fast, and optimized for makers.
          </p>
        </div>
        <div className="grid grid-cols-6 gap-6">
          <Card className="col-span-full lg:col-span-2 cursor-pointer hover:border-zinc-300 dark:hover:border-white/30 hover:-translate-y-1">
            <CardContent className="relative m-auto size-fit pt-8 flex flex-col items-center">
              <div className="relative flex h-32 w-full items-center justify-center">
                <svg className="text-zinc-200 dark:text-zinc-800 absolute inset-0 w-full h-full" viewBox="0 0 254 104" fill="none">
                  <path d={ICONS.customizable} fill="currentColor" />
                </svg>
                <span className="relative z-10 text-6xl font-black tracking-tighter text-zinc-900 dark:text-white">100%</span>
              </div>
              <h2 className="mt-8 text-center text-xl font-bold text-zinc-900 dark:text-white">Customizable</h2>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-3 font-medium">Tailor your profile, project boards, and matching preferences.</p>
            </CardContent>
          </Card>

          <Card className="col-span-full sm:col-span-3 lg:col-span-2 cursor-pointer hover:border-zinc-300 dark:hover:border-white/30 hover:-translate-y-1">
            <CardContent className="pt-8">
              <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-zinc-200 dark:border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-zinc-200 dark:before:border-white/5">
                <svg className="m-auto h-fit w-24" viewBox="0 0 212 143" fill="none">
                  <path className="text-zinc-300 dark:text-zinc-800" d={ICONS.secure_main} fill="currentColor" />
                  <g clipPath="url(#clip0)">
                    <path d={ICONS.secure_main} fill="url(#paint0)" />
                  </g>
                  <path d="M3 72H209" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-cyan-500" />
                  <defs>
                    <linearGradient id="paint0" x1="106.385" y1="1.34375" x2="106" y2="72" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" stopOpacity="0" />
                      <stop offset="1" stopColor="currentColor" className="text-cyan-500" />
                    </linearGradient>
                    <clipPath id="clip0"><rect width="129" height="72" fill="white" transform="translate(41)"/></clipPath>
                  </defs>
                </svg>
              </div>
              <div className="relative z-10 mt-8 space-y-3 text-center">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Secure by default</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Verified profiles, encrypted messages, and project‑based reputation.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full sm:col-span-3 lg:col-span-2 cursor-pointer hover:border-zinc-300 dark:hover:border-white/30 hover:-translate-y-1">
            <CardContent className="pt-8">
              <div className="pt-6">
                <svg className="w-full" viewBox="0 0 386 123" fill="none">
                  <rect width="386" height="123" rx="10" />
                  <g clipPath="url(#clip2)">
                    <circle className="text-zinc-200 dark:text-zinc-800" cx="29" cy="29" r="15" fill="currentColor" />
                    <path d="M29 23V35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M35 29L29 35L23 29" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </g>
                  <path fillRule="evenodd" d={ICONS.faster_1} fill="url(#paint1)" />
                  <path d={ICONS.faster_2} stroke="currentColor" strokeWidth="3" className="text-cyan-500" />
                  <defs>
                    <linearGradient id="paint1" x1="3" y1="60" x2="3" y2="123" gradientUnits="userSpaceOnUse">
                      <stop className="text-cyan-500/15" stopColor="currentColor" />
                      <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                    <clipPath id="clip2"><rect width="358" height="30" fill="white" transform="translate(14 14)"/></clipPath>
                  </defs>
                </svg>
              </div>
              <div className="relative z-10 mt-12 space-y-3 text-center">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Faster than light</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Real‑time matching, instant chat, and seamless project sync.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-3 cursor-pointer hover:border-zinc-300 dark:hover:border-white/30 hover:-translate-y-1">
            <CardContent className="grid pt-8 sm:grid-cols-2 h-full gap-6">
              <div className="relative z-10 flex flex-col justify-between space-y-8">
                <div className="relative flex aspect-square size-14 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-black items-center justify-center">
                  <Shield className="size-6 text-zinc-900 dark:text-white" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Community trust & safety</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">We manually verify every profile and use AI to flag suspicious activity.</p>
                </div>
              </div>
              <div className="relative h-full min-h-[150px] rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02] overflow-hidden flex items-end justify-end p-4">
                <svg className="w-[150%] absolute -bottom-10 -right-10" viewBox="0 0 366 231" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d={ICONS.trust_1} fill="url(#paint3)" />
                  <path d={ICONS.trust_2} stroke="currentColor" strokeWidth="2" className="text-cyan-500" />
                  <defs>
                    <linearGradient id="paint3" x1="0.85108" y1="0.947876" x2="0.85108" y2="230.114" gradientUnits="userSpaceOnUse">
                      <stop className="text-cyan-500/20" stopColor="currentColor" />
                      <stop offset="1" stopColor="currentColor" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-3 cursor-pointer hover:border-zinc-300 dark:hover:border-white/30 hover:-translate-y-1">
            <CardContent className="grid h-full pt-8 sm:grid-cols-2 gap-6">
              <div className="relative z-10 flex flex-col justify-between space-y-8">
                <div className="relative flex aspect-square size-14 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-black items-center justify-center">
                  <Users className="size-6 text-zinc-900 dark:text-white" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Collaborator network effect</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">The more you build, the better your matches become. Your reputation unlocks exclusive opportunities.</p>
                </div>
              </div>
              <div className="relative h-full flex flex-col justify-center space-y-4 pl-4 border-l border-zinc-200 dark:border-white/10">
                <div className="relative flex items-center justify-end gap-3 w-full"><span className="block rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-black px-3 py-1.5 text-xs shadow-sm font-bold text-zinc-900 dark:text-white">Sarah (Designer)</span><img className="size-10 rounded-full border-2 border-white dark:border-zinc-900 object-cover" src="https://randomuser.me/api/portraits/women/68.jpg" alt="" /></div>
                <div className="relative flex items-center justify-start gap-3 w-full"><img className="size-10 rounded-full border-2 border-white dark:border-zinc-900 object-cover" src="https://randomuser.me/api/portraits/men/32.jpg" alt="" /><span className="block rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-black px-3 py-1.5 text-xs shadow-sm font-bold text-zinc-900 dark:text-white">Michael (Dev)</span></div>
                <div className="relative flex items-center justify-end gap-3 w-full"><span className="block rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-black px-3 py-1.5 text-xs shadow-sm font-bold text-zinc-900 dark:text-white">Priya (PM)</span><img className="size-10 rounded-full border-2 border-white dark:border-zinc-900 object-cover" src="https://randomuser.me/api/portraits/women/90.jpg" alt="" /></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Testimonials Section
// ------------------------------------------------------------------
const testimonialData = [
  { text: "CollabHub found me my co-founder in 3 days. We launched our beta 6 weeks later. Nothing else gets you this close to the right people this fast.", image: "https://randomuser.me/api/portraits/men/1.jpg", name: "Aryan K.", role: "Fullstack Dev → Co-founder" },
  { text: "The skill-matching is genuinely different. It matched me with someone whose working style and vision aligned completely.", image: "https://randomuser.me/api/portraits/women/2.jpg", name: "Priya S.", role: "PM at startup" },
  { text: "I used to cold DM on LinkedIn for months. Here I had three serious conversations in a week. Two turned into paid projects.", image: "https://randomuser.me/api/portraits/men/3.jpg", name: "Marcus T.", role: "Freelance designer" },
  { text: "As a solo developer, finding a designer who cares about UX was impossible. CollabHub made it effortless.", image: "https://randomuser.me/api/portraits/men/4.jpg", name: "David L.", role: "Software Engineer" },
  { text: "Our startup's entire founding team met here. We shipped our MVP in 8 weeks thanks to the shared project boards.", image: "https://randomuser.me/api/portraits/women/5.jpg", name: "Elena R.", role: "Co-founder, SaaS" },
  { text: "The reputation system is game-changing. I now have a track record that speaks for itself.", image: "https://randomuser.me/api/portraits/men/6.jpg", name: "James W.", role: "Product Manager" },
];

const col1 = [...testimonialData.slice(0, 3), ...testimonialData.slice(0, 3)];
const col2 = [...testimonialData.slice(3, 6), ...testimonialData.slice(3, 6)];
const col3 = [...testimonialData.slice(1, 4), ...testimonialData.slice(1, 4)];

function TestimonialsSection() {
  return (
    <section id="network" className="py-32 relative overflow-hidden border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mt-2 text-balance text-zinc-900 dark:text-white">Built by top builders.</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-6 text-lg md:text-xl font-medium leading-relaxed text-balance">
            Join thousands of founders, engineers, and designers who skipped the networking events and went straight to building.
          </p>
        </div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] h-[700px] overflow-hidden">
          <TestimonialsColumn testimonials={col1} duration={35} />
          <TestimonialsColumn testimonials={col2} className="hidden md:block" duration={45} />
          <TestimonialsColumn testimonials={col3} className="hidden lg:block" duration={40} />
        </div>
      </div>
    </section>
  );
}

const TestimonialsColumn = ({ className, testimonials, duration = 10 }: { className?: string, testimonials: any[], duration?: number }) => {
  return (
    <div className={className}>
      <motion.div animate={{ translateY: "-50%" }} transition={{ duration, repeat: Infinity, ease: "linear" }} className="flex flex-col gap-6 pb-6">
        {testimonials.map((t, i) => (
          <div key={i} className="relative p-8 rounded-3xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#0A0A0A] shadow-sm max-w-[340px] w-full hover:border-zinc-300 dark:hover:border-white/30 transition-colors cursor-pointer group">
            <p className="text-zinc-900 dark:text-zinc-300 font-medium leading-relaxed mb-8 relative z-10 text-sm group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">"{t.text}"</p>
            <div className="flex items-center gap-4 border-t border-zinc-200 dark:border-white/5 pt-6">
              <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800" />
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">{t.name}</div>
                <div className="text-xs text-cyan-600 dark:text-cyan-500 font-bold">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};