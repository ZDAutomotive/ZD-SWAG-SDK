#include "test.hpp"

template <typename T>
void print(TEST<T>& t)
{
    t.output();
}

// int main() {
//     TEST<int> t(5);
//     print<int>(t);
// }