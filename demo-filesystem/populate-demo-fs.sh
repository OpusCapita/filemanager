#!/bin/bash

SCRIPT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cp -r $SCRIPT_DIR/files/ $1
mkdir -p $1/Misc

########    User settings     ############
MAXDIRS=5
MAXDEPTH=4
MAXFILES=20
MAXSIZE=10
######## End of user settings ############

# How deep in the file system are we now?
TOP=`echo "$1/Misc" |tr -cd '/'|wc -c`

populate() {
	CURDIR=$1

	files=$(($RANDOM*$MAXFILES/32767))
	for n in `seq $files`
	do
		f=`mktemp ${CURDIR}/XXXXXX`
		size=$(($RANDOM*$MAXSIZE/32767))
		head -c $size /dev/urandom > $f
	done

	depth=`echo $CURDIR |tr -cd '/'|wc -c`
	if [ $(($depth-$TOP)) -ge $MAXDEPTH ]
	then
		return
	fi

  dirs=$(($RANDOM*$MAXDIRS/32767))
	for n in `seq $dirs`
	do
		d=`mktemp -d $CURDIR/XXXXXX`
	done

  echo "CURDIR $CURDIR"
  for dir in `find $CURDIR -maxdepth 1 -mindepth 1 -type d` ; do
    echo "dir $dir"
    populate $dir
  done
}

populate $1/Misc
