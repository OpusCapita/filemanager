#!/bin/bash

SCRIPT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

rm -rf $SCRIPT_DIR/demo-fs
cp -r $SCRIPT_DIR/demo-fs.orig $SCRIPT_DIR/demo-fs
mkdir -p $SCRIPT_DIR/demo-fs/Misc

########    User settings     ############
MAXDIRS=5
MAXDEPTH=4
MAXFILES=20
MAXSIZE=10
######## End of user settings ############

# How deep in the file system are we now?
# TOP=`pwd|tr -cd '/'|wc -c`
TOP=`echo "$SCRIPT_DIR/demo-fs/Misc" |tr -cd '/'|wc -c`

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

  for dir in `find $CURDIR -depth 1 -type d`
  do
    populate $dir
  done
}

populate $SCRIPT_DIR/demo-fs/Misc
