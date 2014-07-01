#!/usr/bin/env bash

export LANG=en_us

LDATE=`date '+%d/%b/%Y' -d 'yesterday'`

grep "$LDATE" $*  | grep "tgz" | grep "GET" | cut -d" " -f4,5,7
