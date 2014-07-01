#!/usr/bin/env bash

export LANG=en_us

# LDATE=`date '+%d/%b/%Y' -d 'yesterday'`
LDATE=`date -v-1d '+%d/%b/%Y'`

LDATE=`date '+%d/%b/%Y'`

grep "$LDATE" $*  | grep "tgz" | grep "GET" | cut -d" " -f4,5,7
