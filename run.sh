#!/bin/bash
source dev-env.sh
npm run start:broadcaster &
npm run start:api &
npm run start:opadm &