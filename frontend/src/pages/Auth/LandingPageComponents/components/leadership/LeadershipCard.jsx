import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Quote } from 'lucide-react';
import PropTypes from 'prop-types';

const LeadershipCard = ({ leader }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative h-64 lg:h-auto overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <img
            src={leader.image}
            alt={leader.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${leader.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Quote size={20} className={`bg-gradient-to-r ${leader.gradient} bg-clip-text text-transparent`} />
          </div>
        </div>

        <div className={`p-8 lg:p-10 flex flex-col justify-center ${leader.bgColor} lg:bg-white`}>
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">
                {leader.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className={`w-1 h-6 bg-gradient-to-b ${leader.gradient} rounded-full`} />
                <p className={`text-base font-bold bg-gradient-to-r ${leader.gradient} bg-clip-text text-transparent`}>
                  {leader.role}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-2 top-0 text-4xl text-slate-300 opacity-20">"</div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed pl-4 italic">
                {leader.description}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.a
                whileHover={{ y: -2 }}
                href={leader.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-slate-200"
              >
                <Linkedin size={16} className="text-[#0a66c2]" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LeadershipCard.propTypes = {
  leader: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    gradient: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    social: PropTypes.shape({
      linkedin: PropTypes.string
    }).isRequired
  }).isRequired
};

export default LeadershipCard;