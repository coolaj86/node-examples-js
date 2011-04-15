node fails all the time on arm. Here's some test code.


Compiling On Ubuntu
===

    sudo apt-get install --yes \
      git-core \
      cmake \
      libssl-dev \
      curl

    cd ~/
    git clone https://github.com/joyent/node.git
    cd node
    git checkout v0.4
    cmake \
      -DCMAKE_TOOLCHAIN_FILE=~/toolchain-arm.cmake \
      -DCMAKE_BUILD_TYPE=Debug \
      ..
    # or just `cmake -DCMAKE_BUILD_TYPE=Debug ..` for native builds
    make
    # `sudo make install` for native builds

    cd ~/
    git clone git://github.com/coolaj86/node-examples-js.git
    cd node-examples-js/fails-on-arm
    node http-loop.js

Then just sit and wait. It might take 2 seconds or 10 hours, but it will segfault.

Example toolchain-arm.cmake
====

`toolchain-armv7-gumstix-overo.cmake`:

    SET(CMAKE_SYSTEM_NAME Linux)
    SET(CMAKE_SYSTEM_VERSION 1)
    SET(TOOLCHAIN_PREFIX "$ENV{HOME}/overo-oe/tmp/sysroots/i686-linux/usr/armv7a/bin/arm-angstrom-linux-gnueabi-")
    SET(CMAKE_C_COMPILER   "${TOOLCHAIN_PREFIX}gcc")
    SET(CMAKE_CXX_COMPILER   "${TOOLCHAIN_PREFIX}g++")

    SET(CMAKE_FIND_ROOT_PATH  "$ENV{HOME}overo-oe/tmp/sysroots/i686-linux/usr/armv7a")
    # search for programs in the build host directories
    SET(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
    # for libraries and headers in the target directories
    SET(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
    SET(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
