/*
 * Copyright (c) 2016 Richard Southern
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 * IN THE SOFTWARE.
 */

#ifndef TESTNOISETEXTURE_H
#define TESTNOISETEXTURE_H

#include "noisetexture.h"

template<size_t DIM>
class TestNoiseTexture : public NoiseTexture<DIM>
{
public:
    /// Constructor
    explicit TestNoiseTexture(float /*lower*/ = 0.0f,
                              float /*upper*/ = 1.0f,
                              size_t /*resolution*/ = 64);

    /// Dtor
    ~TestNoiseTexture() {}

protected:
    /// Specialisation of this class to generate pure white noise
    inline GLfloat generator_func(const typename NoiseTexture<DIM>::CoordinateArrayf &);
};

/**
 *
 */
template<size_t DIM>
TestNoiseTexture<DIM>::TestNoiseTexture(float _lower,
                                          float _upper,
                                          size_t _resolution)
    : NoiseTexture<DIM>(_lower,_upper,_resolution)
{
}

/**
 *
 */
template<size_t DIM>
inline GLfloat TestNoiseTexture<DIM>::generator_func(const typename NoiseTexture<DIM>::CoordinateArrayf &coord) {
    return 1.0f;
}

#endif // TESTNOISETEXTURE_H

