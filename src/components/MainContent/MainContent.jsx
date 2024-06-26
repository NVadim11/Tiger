import axios from 'axios';
import bcrypt from 'bcryptjs';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { GameInfoContext } from '../../helpers/context';

import { useUpdateBalanceMutation } from '../../services/phpService';

const MainContent = ({ user }) => {

    return (
        <div></div>
    );
}

export default MainContent;