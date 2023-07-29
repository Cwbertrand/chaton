namespace Application.Core
{
    // <T> stands for generic type which means it will represent any entity like Activity entity
    public class ResultErrorOrSuccess<T>
    {
        public bool IsSuccess { get; set; }
        public T Value { get; set; }
        public string Error { get; set; }

        public static ResultErrorOrSuccess<T> Success(T value) => new() { IsSuccess = true, Value = value};
        public static ResultErrorOrSuccess<T> Failure(string error) => new() { IsSuccess = false, Error = error};

    }
}