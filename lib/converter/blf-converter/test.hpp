#include <iostream>

template <typename T>
struct TEST
{
    T t;
    TEST(T x):t(x) {}
    
    void output() {
        std::cout<<this->t<<std::endl;
    }
};

template <typename T>
void print(TEST<T>& t);